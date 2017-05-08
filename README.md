# **babel-plugin-css-generator-react-components**

Write styles in your React Component, and get the component styled with .css files automatic generated
## Example

The following input:
 ```javascript
 //INPUT.JS
 Element.componentStyle(
    STYLED_DIV = {
        'color': red,
        'position': relative,
        'background-position': center
    },
    STYLED_SPAN = {
        'color': black,
        'background-color': red
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
            'color': red,
            'position': relative,
            'background-position': center
        };
        STYLED_SPAN = {
            'color': black,
            'background-color': red
        };
    }

    render() {
        return (
            <STYLED_SPAN> HOLA </STYLED_SPAN>)
    }
}
 ```
 
 Results in the following output:
 
 ```css
 /*foo.css*/
 .foo-styled_div{color : red;position : relative;background-position : center;}
.foo-styled_span{color : black;background-color : red;}
 ```
 
 ```css
 /*element.css*/
 .element-styled_div{color : red;position : relative;background-position : center;}
.element-styled_span{color : black;background-color : red;}
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
            className: 'merka-element-styled_div sarasa'
        },
        React.createElement(
            'span',
            {
                className: 'merka-element-styled_span'
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
                className: 'merka-foo-styled_span'
            },
            ' HOLA '
        );
    }
}
 ```
