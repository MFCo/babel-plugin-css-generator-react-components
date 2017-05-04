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
          // fs.writeFile("css/root.css", importString, function (err) {
          //   if (err) return;
          // });
        }
      },
      Class: {
        enter(path, state) {
          var className = path.node.id.name;
          path.node.body.body.map(function (element) {
            let name = element.key.name;
            if (name === 'marianoStyle') {
              element.body.body.map(function (expression) {
                let nameStyle = '--' + className;
                nameStyle += '-' + expression.expression.left.name;
                var styleString = "." + nameStyle + "{";
                expression.expression.right.properties.map(function (atts) {
                  styleString += atts.key.value + " : " + atts.value.name + ";";
                })
                styleString += "}";
                console.log(styleString);
              })
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
          console.log(path.node.children);
          if (path.node.openingElement.name.name === 'STYLED_DIV') {
            let id = c.jSXIdentifier('div');
            let className = c.jSXIdentifier('className');
            let stringLiteral = c.stringLiteral('asdasd');
            let att = c.jSXAttribute(className, stringLiteral);
            let opening = c.jSXOpeningElement(id, [att], false);
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