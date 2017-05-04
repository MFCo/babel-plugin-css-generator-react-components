"use strict";

var fs = require('fs');

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
          var className = path.node.id.name;
          path.node.body.body.map(function (element) {
            let name = element.key.name;
            if (name === 'marianoStyle') {
              let nameStyle = "--" + className;
              styles.push(nameStyle);
              var styleString = "." + nameStyle + "{";
              element.body.body.map(function (expression) {
                styleString += expression.expression.left.name + " : " + expression.expression.right.name + ";";
              })
              styleString += "}";
              fs.writeFile("css/" + className + ".css", styleString, function (err) {
                if (err) return;
              });
              importString += '@import \'./' + className + '.css\';' + '\n';
              //console.log(styleString);
            }
          });
        }
      },
      ClassMethod: {
        enter(path, state) {
          switch (path.node.key.name) {
            case "marianoStyle":
              path.remove();
              break;
            case "render":
              path.node.body.body.map(function (element) {
                if (element.type == 'ExpressionStatement') {
                  //console.log(element.expression.openingElement.attributes);
                }
              });
              break;
            default: break;
          }
        }
      },
      JSXExpressionContainer: {
        enter(path, state) {
          path.node.expression.value = styles[styles.length - 1];
          styles.pop();
          //path.replaceWithSourceString(styles[styles.length - 1]);
        }
      }
    }
  }
};