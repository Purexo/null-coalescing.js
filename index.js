const vm = require('vm')

const acceptedCharacter = ['.', '[']

/**
 * return a normalized path
 * normalyzePath() -> ''
 * normalyzePath('  ') -> ''
 * normalyzePath(' bar.baz ') -> '.bar.baz'
 * normalyzePath('  ['b  ar'].baz  ') -> '['b  ar'].baz'
 */
function normalyzePath(path = '') {
    path = path.trim()

    if (path.length > 0) {
        return acceptedCharacter.indexOf(path.charAt(0)) === -1 ? `.${path}` : path
    }
    return path
}

/**
 * get the value of nested object without failling
 * use this function if you want have a 'short-syntaxe' like `const foo = bar.baz || 'default'` without error
 * 
 * you can use bind parameter or .bind(context) or .call(context, ...) for advanced usage (need access some var with evaluatedPath)
 * 
 * @param object : any - undefined by default
 * @param evaluatedPath : string - '' by default
 * @param defaultValue : any - undefined by default
 * 
 * @param bind : any - pass variables you want use in evaluatedPath
 * @this : any you should use .call(bindParameters, ...) or .bind(bindParameters)() if you don't use `bind` parameter
 * 
 * @returns any - the result or default value
 * 
 * @example
 *  const $N = require('null-coalescing')
 * 
 *  let foo = $N(bar, 'baz', 'default')
 *      // instead foo = bar.baz || 'default' (if bar unset : raise TypeError)
 * 
 *  foo = $N(bar, `['baz'].foo[0].name`)
 *      // instead foo = bar['baz'].foo[0].name || undefined (if anything undefined in path : raise TypeError)
 * 
 *  foo = $N(bar, '[baz].foo[0].name', 'default', {baz})
 *  foo = $N.bind({baz})(bar, '[baz].foo[0].name', 'default')
 *  foo = $N.call({baz}, bar, '[baz].foo[0].name', 'default')
 */
function $N(object = undefined, evaluatedPath = '', defaultValue = undefined, bind = undefined) {
    const path = normalyzePath(evaluatedPath)
    const sandbox = Object.assign({}, bind || this || {}, {
        object,
        defaultValue,
        result: defaultValue
    })
    
    const context = vm.createContext(sandbox);

    vm.runInContext(`
        try {
            result = object${path} || defaultValue
        } catch (e) {}
    `, context)

    return sandbox.result
}

module.exports = $N