const $N = require('./null-coalescing')
const bar = {}
const baz = 'key'
bar[baz] = {
    foo: [{name : 'name'}]
}

let foo = $N.call({baz}, bar, '[baz].foo[0].name', 'default') // ne fonctionnera pas , baz (si il existe dans le context appellant) n'est pas encore transmis
console.log(foo)