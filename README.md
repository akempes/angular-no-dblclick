# angular-no-dblclick

This directive will prevent double click events on any element. Just a few simple lines give you full control.

## Getting Started

You can install an angular-no-dblclick package very easily using Bower:

```shell
bower install angular-no-dblclick
```

And add the file to your index page:

```html
<script src="angular-no-dblclick/dist/no-dblclick.js"></script>
```

Finally add 'noDblclick' to your main module's list of dependencies:

```js
angular.module('myApp', [
	...
    'noDblclick',
    ...
]);
```

## How to use

To get it working simply add the attribute ```no-dblclick``` to your element:

```html
<button no-dblclick>Click me!</button>
```
Optionally, you can add a key for reference:

```html
<button no-dblclick="myKey">Click me!</button>
```
The element will be disabled after the very first click.

## How to control

### Release locked element(s)
To release all elements in the scope just broadcast this event:

```js
$scope.$broadcast('noDblclick.unlock');
```

The second argument is optional. To release a single locked element simply broadcast on your scope with the key:

```js
$scope.$broadcast('noDblclick.unlock', 'myKey');
```

To release all elements in your application at once:

```js
$Rootcope.$broadcast('noDblclick.unlock');
```

### Lock element(s)

Actually this works the same as releasing element(s):

To lock a element:

```js
$scope.$broadcast('noDblclick.lock', 'myKey');
```

To lock all directives in the scope:

```js
$scope.$broadcast('noDblclick.lock');
```

To lock all directives:

```js
$Rootcope.$broadcast('noDblclick.lock');
```
