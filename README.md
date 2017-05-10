# **babel-plugin-css-generator-react-components**

Write styles in your React Component, and get the component styled with .css files automatic generated
## Example

The following input:
 ```javascript
 //INPUT.JS
 Element.componentStyle(
    STYLED_DIV = {
        'color': 'red',
        'position': 'relative',
        'background-position': 'center',
        '&:hover': {
            'color': 'blue',
            'position': 'absolute'
        },
        'background-color': 'green',
        '&::after': {
            'color': 'black'
        },
        '&__title': {
            'font-size': '15px'
        }
    },
    STYLED_SPAN = {
        'color': 'black',
        'background-color': 'red'
    }
);

function Element(props) {
    return (<STYLED_DIV className="sarasa"><STYLED_SPAN>HOLA</STYLED_SPAN></STYLED_DIV>);
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
            <STYLED_SPAN> HOLA </STYLED_SPAN>)
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
            className: 'sample-element-styled_div sarasa'
        },
        React.createElement(
            'span',
            {
                className: 'sample-element-styled_span'
            },
            'HOLA'
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
            ' HOLA '
        );
    }
}
 ```
