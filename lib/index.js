"use strict";

var fs = require('fs');
var c = require('babel-types');
const postCSS = require('postcss');
const nestedCSS = require('postcss-nested');
var stylefmt = require('stylefmt');
var autoprefixer = require('autoprefixer');


Object.defineProperty(exports, "__esModule", {
  value: true
});

var styles = [];
var importString = '';
var target = new Map();

function createJSXElement(tag, atts, children) {
  let id = c.jSXIdentifier(tag);
  let className = c.jSXIdentifier('className');
  let stringLiteral = c.stringLiteral(styles[styles.length - 1].get(tag));
  let att = c.jSXAttribute(className, stringLiteral);
  atts = atts.filter(function (a) {
    if (a.name.name === 'className') {
      att.value.value += ' ' + a.value.value;
    }
    if (a.name.name === '_target') {
      att.value.value += ' ' + target.get(a.value.value);
    }
    return ((a.name.name !== 'className') && (a.name.name !== '_target'));
  });
  let opening = c.jSXOpeningElement(id, [att].concat(atts), false);
  let closing = c.jSXClosingElement(id);
  let element = c.jSXElement(opening, closing, children, true);
  return element;
}

function getAttributes(attList, parent) {
  var attsString = '';
  attList.map(function (atts) {
    if (atts.value.properties === undefined) {
      if (atts.key.value.charAt(0) === '@') {
        target.set(atts.value.value, parent);
      }
      else {
        attsString += atts.key.value + ' : ' + atts.value.value + ';';
      }
    }
    else {
      var newParent = parent + atts.key.value.slice(1);
      attsString += atts.key.value + '{' + getAttributes(atts.value.properties, newParent) + '}';
    }
  })
  return attsString;
}

function createCSS(assignment, accessCSSProps, accessName, className, prefix) {
  var styleMap = new Map();
  var styleString = '';
  assignment.map(function (expression) {
    let nameStyle = '';
    if (prefix !== undefined) {
      nameStyle += prefix + '-';
    }
    nameStyle += className;
    let nameComp = accessName(expression).toLowerCase();
    nameStyle += '-' + nameComp;
    var classSelectors = '';
    let tag = nameComp.slice((('STYLED_').length));
    styleMap.set(tag.toLowerCase(), nameStyle);
    styleString += '.' + nameStyle + '{' + getAttributes(accessCSSProps(expression), nameStyle);
    styleString += '}\n';
    styleString += classSelectors;
    styles.push(styleMap);
  })
  var finalCSS = '';
  postCSS([nestedCSS, stylefmt, autoprefixer]).process(styleString).then(result => {
    finalCSS = result.css;
    fs.writeFile('css/' + className + '.css', finalCSS, function (err) {
      if (err) return;
    });
  });
  importString += '@import \'./' + className + '.css\';\n';
}


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
            if (name === 'componentStyle') {
              createCSS(element.body.body,
                function (e) { return e.expression.right.properties; },
                function (e) { return e.expression.left.name; },
                className,
                state.opts.prefix);
            }
          });
        }
      },
      ClassMethod: {
        enter(path, state) {
          switch (path.node.key.name) {
            case 'componentStyle':
              path.remove();
              break;
            default: break;
          }
        }
      },
      CallExpression: {
        enter(path, state) {
          if (path.node.callee.property === undefined) return;
          switch (path.node.callee.property.name) {
            case 'componentStyle':
              var className = path.node.callee.object.name.toLowerCase();
              createCSS(path.node.arguments,
                function (e) { return e.right.properties },
                function (e) { return e.left.name },
                className,
                state.opts.prefix
              );
              path.remove();
              break;
            default: break;
          }
        }
      },
      JSXElement: {
        enter(path, state) {
          if (styles.length === 0) return;
          let nameComp = path.node.openingElement.name.name;
          let tag = nameComp.slice(('STYLED_').length).toLocaleLowerCase();
          if ((nameComp.match(/STYLED_*/) !== null) && (styles[styles.length - 1].get(tag) !== undefined)) {
            let element = createJSXElement(tag, path.node.openingElement.attributes, path.node.children);
            path.replaceWith(element);
            styles.pop();
          }
        }
      }
    }
  }
};