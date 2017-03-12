import test from 'tape';
import loopBreaker from '../src/';

testBrokenLoop('while with body', (cont) => {
  while (cont()) {
    void(0);
  }
});

testBrokenLoop('while without body', (cont) => {
  while (cont()) void(0);
});

testBrokenLoop('for with body', (cont) => {
  for (var i = 0; cont(); i++) {
    void(0);
  }
});

testBrokenLoop('for without body', (cont) => {
  for (var i = 0; cont(); i++) void(0);
});

testBrokenLoop('do-while with body', (cont) => {
  do {
    void(0);
  } while (cont());
});

function testBrokenLoop(message, fn) {
  test(message, (assert) => {
    const startTime = Date.now();
    const fnSource = loopBreaker(fn.toString());
    const modifiedFn = eval(fnSource);
    assert.throws(
      () => modifiedFn(() => Date.now() - startTime < 5000),
      /loop broken/i
    );
    assert.end();
  });
}
