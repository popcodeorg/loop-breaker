# loop-breaker

A simple library that transforms JavaScript code to prevent loops from running
infinitely.

`loop-breaker` has the same goals as, and takes inspiration from,
[`loop-protect`](https://github.com/jsbin/loop-protect). However, while
`loop-protect` uses regular expressions to transform loops (smaller library
size, [less accurate](https://github.com/jsbin/loop-protect/issues/16)), `loop-breaker` uses an AST transform (bigger library,
reliably accurate).

## Installation

`loop-protect` can be installed via `npm`/`yarn`:

```sh
$ npm install loop-protect
```

or

```sh
$ yarn add loop-protect
```

Or as a [standalone
script](https://github.com/popcodeorg/loop-breaker/releases) in the browser:

```html
<script src="/js/loopBreaker.min.js"></script>
```

## How it works

Modifies input code to do the following:

* Adds a top-level function `__loopBreaker` which checks whether the currently
  executing loop should be broken
* Injects into `for`, `while`, and `do-while` loops a call to `loopBreaker()`

The loop is considered likely-infinite if the following two conditions hold:

* The loop has executed at least ten thousand times
* The loop has been running for at least one second of wall time

So, with the original input code:

```js
for (var i = 0; i < 1000000; i--) {
  console.log(i);
}
```

Will look like this:

```js
var __loopBreaker = (function() {
  var count = 0;
  var startTime;
  return function() {
    startTime || (startTime = Date.now());
    count += 1;
    if (count > 10000 && (Date.now() - startTime > 1000)) {
      throw new Error("Loop Broken!");
    }
  };
}());
for (var i = 0; i < 1000000; i--) {
  __loopBreaker();
  console.log(i);
}
```
