# **babel-plugin-css-generator-react-components**

Generate .css files from API, styles in JS Edit

## Example

The following input:
 ```javascript
 //INPUT.JS
 class Foo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("mounted");
    }

    marianoStyle() {
        STYLED_DIV = {
            'color': red,
            'position': relative,
            'background-position': asdasd
        };
        STYLED_SPAN = {
            'color': black,
            'background-color': red
        };
    }

    render() {
        return (
            <STYLED_DIV> HOLA </STYLED_DIV>)
    }
}
 ```
 
 Results in the following output:
 
 ```css
 /*Foo.css*/
.--Foo-STYLED_DIV{color : red;position : relative;background-position : asdasd;}
.--Foo-STYLED_SPAN{color : black;background-color : red;}
 ```
 
 ```css
 /*root.css*/
 @import './Foo.css';
 ```
 
 ```javascript
 //BABEL OUTPUT
 class Foo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("mounted");
    }

    render() {
        return React.createElement(
            'div',
            {
                className: '--Foo-STYLED_DIV'
            },
            ' HOLA '
        );
    }
}
 ```
