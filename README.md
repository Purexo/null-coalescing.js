# null-coalescing.js
Simulate null-coalescing operator like in php with a function

## Installation
```bash
$ npm install --save null-coalescing
$ # or
$ npm install --save git+https://github.com/Purexo/null-coalescing.js.git # if you don't want depend to npm-registery
```

## Usage
```js
const $N = require('null-coalescing')

const bar = {
  anonymous: true
}
const object = {
  foo: {
    bar: 'baz'
  }
}
object[bar] = {
  baz: [
    {name: 'name'}
  ]
}
```

Signature of `$N` function :

```js
function $N(object = undefined, evaluatedPath = '', defaultValue = undefined, bind = undefined) {}
```

### Simple use-case :

```js
$N(object, 'foo.bar') // 'baz'
// and with dirty path string
$N(object, '  foo.bar ') // 'baz' (It work)

$N(object, `['foo'].bar.length`) // 3
```

### Use-case with default value :

```js
$N(object, 'bar.foo', 'Oh No, a savage default value !!!') // 'Oh No, a savage default value !!!'
```

its roughly equivalent to `object.bar.foo || 'Oh No, a savage default value !!!'`    
but without TypeError breaking your code ^^    
it's more like

```js
var value = 'Oh No, a savage default value !!!'
try { value = object.bar.foo || value }
catch (e) {}
```

Yeah `value` is OK (with so many unclear lines)

### Let's magic enter in your heart !
Notice `[bar]` in 2nd argument and `{bar}` the last argument or in bind or first arg of call

```js
$N(object, `[bar].baz.name`, 'default', {bar}) // 'name'
$N.bind({bar})(object, `[bar].baz.name`) // 'name'
$N.call({bar}, object, `[bar].baz.name` // 'name'
$N.call({bar}, object, `[bar].baz.name.notExistroperty` // undefined
// object[bar].baz.name || 'default' // but without TypeError throwed in your face <3
```

In truth there is no magic, just a trick with nodejs vm module, this code use [vm.runInContext](https://nodejs.org/api/vm.html#vm_vm_runincontext_code_contextifiedsandbox_options) 

NodeJs with module, require, and files are really separated, no possibility to get the context of caller, so you need use the bindArgs
or bind this to `$N` function with needed var of your context you want access with `evaluatedPath` argument

### Don't know why you could use like that, but it's possible

```js
$N() // undefined
$N(undefined, 'foo.bar', 'default') // 'default'
```