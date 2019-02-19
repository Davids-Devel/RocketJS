# RocketJS [![npm version](https://badge.fury.io/js/rocket-translator.svg)](https://badge.fury.io/js/rocket-translator)

Translate HTML code to Vue or React.

## Instalation

To install simply: Use npm

```sh 
npm i -g rocket-translator
```
or Yarn

```sh
yarn global add rocket-translator
```

## Getting Started

### Basic

You can convert this:

```html
<div>Hello {name - state - "World"}!</div>
```
into this:

```jsx
import React, {Component} from "react";

class MyComponent extends Component {
    constructor() {
        super();
        this.state = {
            name:"World"
        };
    }
    render(){
        return(
            <div>Hello {this.state.name}!</div>
        )
    }
}
export default MyComponent;
```
or this:

```html
<template>
    <div>Hello {{name}}!</div>
</template>
<script>
    export default {
        name:"MyComponent",
        data(){
            return {
                name:"World"
            }
        }
    }
</script>
```

### How to Use

To use, simpy create a HTML file, with the code to translate, and run:

```sh
rocket [mode] path/to/file.html [output folder]
```

The **mode** may be `vue` or `react`.

The **output folder** is optional, if this is not defined will create a folder named **dist**.

## Guide

* [States Simple](#states-simple)
* [Props](#props)
* [Computed](#computed)
* [Methods](#methods)
* [Components](#components)
* [Watchers](#watchers)
* [Inputs Handler](#inputs)
* [Conditionals](#conditionals)
* [List Render](#loops)
* [Bind Attributes](#binds)
* [JavaScript Management](#js-management)
* [HTML Syntax](#syntax)

### States Simple <a name="states-simple"></a>

A **State** in a Vue or React component, are a way to set data that affect the view, and when this changes, the component re-render the view.

To get values from the HTML, we must declare into `{}`. And to the declare a state, we have 2 modes to set it: **Simple**, **With Value**.

The **Simple** mode, is declared writing only the state name into the template and writing the type: **state**.

Example:

```html
<div>{myState - state}</div>
```

In the **With Value** mode, is declared when, we write the state name, the type: **state** and the value for this state.

Example:

```html
<div>{stateName - state - "Some Value"}</div>
```
The **value** may be `String`, `Number`, `Boolean`,`Array` and  `Object`.

And in the **simple** case, we obtain the next component state.

In Vue:

```js
data(){
    return {
        myState:""
    }
}
```
And in React we obtain:

```js
this.state = {
    myState:""
}
```

In the **With value** case we obtain. In Vue:

```js
data(){
    return {
        stateName:"Some Value"
    }
}
```

And in React:

```js
this.state = {
    stateName:"Some Value"
}
```

To know more about states, and JavaScript Management. You can see [JavaScript Management](#js-management) section. 

### Props <a name="props"></a>

The **props** in a component, are data that a parent \(**container**\) component pass to a child component.

And like the **state**, we may declare a prop with this format `{propName - prop}`.

Example:

```html
<div>{parentData - prop}</div>
```

And declaring a prop, the final template will render, in Vue:

```js
props:{
    parentData:{
        type:String,
        required:true,
        default:"Hello World"
    }
}
```
And in React, auto declares the prop.

```js
return(
    <div>{this.props.parentData}</div>
)
```

### Computed <a name="computed"></a>

A **Computed** propierty is a function that return a `String` or `Number` value, and this is render on the template. And to declare a computed propierty, simply we can set the computed propierty name and the type: **computed** and create the function to execute that match with the computed name.

```html
<div>{hello - computed}</div>
```
```js
function hello() {
    return "Hello World";
}
```
This will create a computed properties that returns a **Hello World**.

Example:
```html
<div>Hi I Am {fullName - computed}!</div>
<script>
function fullName() {
    var name = "Foo";
    var lastName = "Bar";

    return name + " " + lastName;
}
</script>
```
Too know more about JavaScript Management go to [JavaScript Management](#js-management) section.

### Methods <a name="methods"></a>

A **Method** is a function executed by an event on the final render or by the render. Is not necesary declare the method only set the event into the tag.

```html
<button onclick="hello()">Say Hello</button>
<script>
function hello() {
    alert("Hello World");
}
</script>
```

### Components \(**Partial**\)<a name="components"></a>

To import a **component** inside the main component. Only add the tag with the component syntax.

```html
<MyComponent />
```
And to add a attr with a state value add `:` on the attr front.

```html
<MyComponent :my-bind-attr="stateName" />
```

To write the component content, add a `component` tag with the component content. And an attr `component-name` with the component name. And others attrs can be passed to the component.

```html
<component component-name="HelloWorldComponent" name="World">
    <div>
        <h1>Hello {name - prop}!</h1>
    </div>
</component>
```

### State Watchers <a name="watchers"></a>

To define a **State Watcher** you must create the function `setStateWatchers` this function must return all the states watchers.

```js
function setStateWatchers() {
    return {
        state(e) {
            //Handle State
        },
        anotherState: function(e) {
            //Handle Another State
        }
    }
}
```

Also you can define as a `var`, `let` or `const`.

```js
const setStateWatchers = () => {
    return {
        //Watchers
    }
}
```

### Inputs Handler <a name="inputs"></a>

To **handle** a input, you must add the attr `name` on the input tag, and the value will be take to add a state with that name.

```html
<input type="text" name="username" />
```

On **Vue** will render.

```html
<template>
    <input type="text" v-model="username" name="username"/>
</template>
<script>
    export default {
        name:"MyComponent",
        data() {
            return {
                username:""
            }
        }
    }
</script>
```

On React.

```jsx
import React, {Component} from "react";

class MyComponent extends Component {
    constructor() {
        super();
        this.state = {
            username:""
        }
    }
    inputHandler({target}){
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }
}
```

### Conditionals <a name="conditionals"></a>

To declare a **conditional**, add the `if` tag, with the `cond` attr, where `cond` is the condition to evaluate.

Example:

```html
<if cond="auth">
    <span>Congratulations! you are Sign in this platform</span>
</if>
```

And you can set it with an `else` tag.
```html
<if cond="password.length < 6">
    <span>Password must have more of 6 characters</span>
</if>
<else>
    <span>Password is very strong</span>
</else>
```
Since version **2.0.0** we add the `else-if` tag. Like the `if` tag, this take the attr `cond` with the condition.

```html
<if cond="age < 18">
    <span>Too Young</span>
</if>
<else-if cond="age > 30">
    <span>Too Old</span>
</else-if>
```
### List Render <a name="loops"></a>
Like the conditionals, add a loop is't very easy, add a `for` tag, with the `val` attr.

```html
<for val="varName in stateName">
    <span>{varName}</span>
</for>
```

### Bind Attributes <a name="binds"></a>
A **Bind Attribute** is a form to set a state value on a tag attribute. And the syntax is like on Vue.

```html
<span :style="stateName">Hello World</span>
```

If you want add a default value you must add a `-` followed of the value.

```html
<button :class="classButton - 'value'"></button>
```

### JavaScript Management <a name="js-management"></a>

To the JavaScript Management, we add a few of keywords to help with the code imports. We must follow some rules to the correctly function of the translator.

To include JavaScript on the template, add a `script` tag with the JavaScript code to translate. Or you can add the line `#js path/to/js.js` to import a external file.

#### Lifecycles
Since version `2.0.0` we add supports for framework **lifecycle**; and like methods and computed, all lifecycles will be filtered.

We add 8 lifecycles to define the final component.

* **setInitialState**
* **setStateWatchers**
* **beforeMount**
* **mounted**
* **beforeUpdate**
* **updated**
* **beforeUnmount**
* **unmounted**

##### Set Initial States

`setInitialState` have the same function that the `state` keyword in previous versions, this define **states** that will not be rendered on template.

Example:

```html
<div>
    <span>Hi I Am: {fullName - computed}</span>
</div>
<script>
    function setInitialState() {
        return {
            name: "Foo",
            lastName: "Bar"
        }
    }
    function fullName() {
        return `${name} ${lastName}`;
    }
</script>
```

##### Set State Watchers

`setStateWatchers` have the same function that the `watch` keyword in previous versions, this define all the states **watchers**.

Example:

```html
<div>
    <span>You have do {clicks - state - 0} clicks</span>
    <button onclick="countClick()">Do Click</button>
</div>
<script>
    function setStateWatchers() {
        return {
            clicks(clicksNumber) {
                if (clicksNumber > 10) {
                    alert("You do more than 10 clicks");
                }
            }
        }
    }
    function countClick() {
        clicks++;
    }
</script>
```

#### Functions

The **Functions** are to change the method and computed properties execution. If the method or computed name match with the function name, this will be that method or computed.

```html
<div>
    <span>This is my {computedPropierty - computed} propierty</span>
    <button onclick="sayHello()">Say Hello</button>
</div>
<script>
    function computedPropierty() {
        return "Computed"
    }

    function sayHello() {
        alert("Hello World");
    }
</script>
``` 

#### Filter

The **JavaScript Filter** is structured to filter the states and props. If into the code we have a function that contain a var with the state or prop name, this will be replaced automaticaly. Is not necesary declare like a state.

```js
function setInitialState() {
    return {
        name: "Hello",
        lastName: "World"
    }
}

function sayHello() {
    alert(name + " " + lastName);
    /* 
        will return on React: alert(this.state.name + " " + this.state.lastName);
        and on Vue: alert(this.name + " " + this.lastName);
    */
} 
```
**Note**: You must evite use vars with state names, until we fix this.

### HTML Syntax <a name="syntax"></a>

Like on JavaScript, on HTML we have a specific **syntax**, that we must follow to the correctly translator function.

#### Bars Declaration

The most used is the **bars declaration** `{}`, this is used to assign a state, prop, computed or the out framework syntax.

Framework Declarative Syntax: `{ name }`

State without value: `{stateName - state}`

State With Value: `{stateName - state - value}`
The `value` can be type: `String`, `Number`, `Boolean`, `Array`, `Object`, `null`, `undefined`, `NaN` or `Infinity`.

Prop: `{propName - prop}`

Computed Propierty: `{computedName - computed}`

#### Import Tag

To import a JavaScript external file, we use: `#js path/to/js.js`.

**Note**: We want add **CSS** Support.

#### Bind Attributes

To execute JavaScript syntax or assign a state or prop value on an HTML attribute, we use `:attrName="Js or State"`.

#### Conditionals And Loops Tags

We add three HTML tags to assign **Conditionals** and **Loops**. `if`, `else-if`, `else` and `for`.

```html
<if cond="condToEvaluate">
    <span>If Content</span>
</if>
<else-if cond="condToEvaluate">
    <span>Else If Content</span>
</else-if>
<else>
    <span>Else Content</span>
</else>
<for val="varName in stateName">
    <span>For Content</span>
</for>
```
#### Component Tag

We add this tag to declare a **custom** component inside the **Main Component**

```html
<component component-name="ComponentName">
    <span>Component Content</span>
</component>
```
## To Do

### Features Support

- [x] States
- [x] Methods
- [x] Computed
- [x] Props
- [x] States Watchers
- [x] Components
- [x] Bind States, Props, JS Expresions
- [x] Input Handlers
- [x] JavaScript Management \(**partial**\)
- [x] Conditionals
- [ ] Nested Conditionals 
- [x] Loops
- [ ] Nested Loops
- [ ] Inner HTML 
- [ ] Lifecycles
- [ ] React without JSX
- [ ] React without ES6
- [ ] Vue Standalone
- [ ] Next Framework
- [ ] Angular Support

**Note:** If you see that some feature is missing, you can open a pull request or write an issue, and tell what feature is missing.

## Contributing

To contribute you can open a **pull request** with the changes to improve in the code, or open a new **issue**.
