# kv

This is a fork of [`idk-kv`](https://github.com/jakearchibald/idb-keyval).

A super simple key value store backed by IndexedDB.

Since it is backed by IndexedDB, you can store anything structured-clonable (numbers, arrays, objects, dates, blobs etc - but beware of browser support).

It's best used with a module loader (webpack, browserify, etc...) so that the global scope isn't poluted with `kv`.

## Usage

### kv(`string` name) `kv`

Creates a custom kv store with a given name.

```js
const store = kv('sw-storage');
await store.set('hello', 'world');
console.log(await kv.get('hello'));
// -> undefined
```

### kv.set(`string` key, `*` value) `Promise`

```js
await kv.set('hello', 'world');
await kv.set('foo', 'bar');
```

```js
try {
  await kv.set('hello', 'world')
  console.log('It worked!');
} catch(err) {
  console.log('It failed!', err);
}
```

### kv.get(`string` key) `Promise<*>`

```js
console.log(await kv.get('hello'));
// -> "world"
```

### kv.keys() `Promise<string>`

```js
console.log(await kv.keys());
// -> ["hello", "foo"]
```

### kv.remove(`string` key) `Promise`

```js
await kv.remove('hello');
```

### kv.clear() `Promise`

```js
await kv.clear();
```

That's it!