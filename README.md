# **babel-plugin-css-generator-react-components**

Write styles in your React Component, and get the component styled with .css files automatic generated. We support nested definitions. 

Before the output we use Autoprefix, and PostCSS-nested.

You can see in the following example how to make nested classes references.

The main advantage in using our plugin is that you don't need to write classNames, or to be afraid about your CSS' classes names.
## Example

The following input:
 ```javascript
 //INPUT.JS
 Element.componentStyle(
    STYLED_DIV = {
        'color': 'red',
        'position': 'relative',
        'background-position': 'center',
        'display': 'flex',
        '&:hover': {
            'color': 'blue',
            'position': 'absolute'
        },
        'background-color': 'green',
        '&::after': {
            '@@target': 'div_after',
            'color': 'black'
        },
        '&__title': {
            '@@target': 'div_title',
            'font-size': '15px',
            '&__subs': {
                '@@target': 'div_title_sub',
                'color': 'white'
            }
        }
    },
    STYLED_SPAN = {
        'color': 'black',
        'background-color': 'red'
    }
);

function Element(props) {
    return (<STYLED_DIV className="container" _target="div_title"><STYLED_SPAN>Hi stateless!</STYLED_SPAN></STYLED_DIV>);
}

class Foo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("mounted");
    }

    componentStyle() {
        STYLED_DIV = {
            'color': 'red',
            'position': 'relative',
            'background-position': 'center'
        };
        STYLED_SPAN = {
            'color': 'black',
            'background-color': 'red'
        };
    }

    render() {
        return (
            <STYLED_SPAN> Hi! </STYLED_SPAN>)
    }
}
 ```
 And the following .babelrc (now we support custom prefix)
 ```JSON
 {
    "plugins": [
        [
            "babel-plugin",
            {
                "prefix": "sample"
            }
        ],
        "transform-react-jsx"
    ]
}
 ```
 
 Results in the following output:
 
 ```css
 /*foo.css*/
 .sample-foo-styled_div {
  color: red;
  position: relative;
  background-position: center;
}

.sample-foo-styled_span {
  color: black;
  background-color: red;
}
 ```
 
 ```css
 /*element.css*/
 .sample-element-styled_div {
  color: red;
  position: relative;
  background-position: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  background-color: green;
}

.sample-element-styled_div:hover {
  color: blue;
  position: absolute;
}

.sample-element-styled_div::after {
  color: black;
}

.sample-element-styled_div__title {
  font-size: 15px;
}

.sample-element-styled_div__title__subs {
  color: white;
}

.sample-element-styled_span {
  color: black;
  background-color: red;
}

 ```
 
 ```css
 /*root.css*/
 @import './element.css';
 @import './foo.css';
 ```
 
 ```javascript
 //BABEL OUTPUT
 function Element(props) {
    return React.createElement(
        'div',
        {
            className: 'sample-element-styled_div container sample-element-styled_div__title'
        },
        React.createElement(
            'span',
            {
                className: 'sample-element-styled_span'
            },
            'Hi stateless!'
        )
    );
}

class Foo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("mounted");
    }

    render() {
        return React.createElement(
            'span',
            {
                className: 'sample-foo-styled_span'
            },
            ' Hi! '
        );
    }
}
 ```
