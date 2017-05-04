"use strict";

var fs = require('fs');
var c = require('babel-types');

Object.defineProperty(exports, "__esModule", {
  value: true
});

var styles = [];
var importString = '';

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      Program: {
        exit(path, state) {
          fs.writeFile("css/root.css", importString, function (err) {
            if (err) return;
          });
        }
      },
      Class: {
        enter(path, state) {
          var className = path.node.id.name.toLowerCase();
          path.node.body.body.map(function (element) {
            let name = element.key.name;
            if (name === 'marianoStyle') {
              var styleMap = new Map();
              var styleString = '';
              element.body.body.map(function (expression) {
                let nameStyle = className;
                let nameComp = expression.expression.left.name.toLowerCase();
                nameStyle += '-' + nameComp;
                let tag = nameComp.slice((('STYLED_').length));
                styleMap.set(tag.toLowerCase(), nameStyle);
                styleString += "." + nameStyle + "{";
                expression.expression.right.properties.map(function (atts) {
                  styleString += atts.key.value + " : " + atts.value.name + ";";
                })
                styleString += "}\n";
                styles.push(styleMap);
              })
              fs.writeFile('css/' + className + '.css', styleString, function (err) {
                if (err) return;
              });
              importString += '@import \'./' + className + '.css\';\n';
            }
          });
        }
      },
      ClassMethod: {
        enter(path, state) {
          switch (path.node.key.name) {
            case 'marianoStyle':
              path.remove();
              break;
            case 'render':
              //console.log(path.node.body.body);
              break;
            default: break;
          }
        }
      },
      JSXElement: {
        enter(path, state) {
          if (path.node.openingElement.name.name === 'STYLED_DIV') {
            let id = c.jSXIdentifier('div');
            let className = c.jSXIdentifier('className');
            let stringLiteral = c.stringLiteral(styles[styles.length - 1].get('div'));
            let att = c.jSXAttribute(className, stringLiteral);
            let opening = c.jSXOpeningElement(id, [att].concat(path.node.openingElement.attributes), false);
            let closing = c.jSXClosingElement(id);
            let element = c.jSXElement(opening, closing, path.node.children, true);
            path.replaceWith(element);
          }


          // path.replaceWith(
          //   jsx({
          //     elementName: 'div',
          //     attributes: {},
          //     children: path.children
          //   })
          // )
          // t.JSXElement();
          //path.node.expression.value = styles[styles.length - 1];
          //styles.pop();
          //path.replaceWithSourceString(styles[styles.length - 1]);
        }
      }
    }
  }
};