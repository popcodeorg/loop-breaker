import test from 'tape';
import loopBreaker from '../src/';

testBrokenLoop('while with body', (c) => {
  while (c()) {
    void(0);
  }
});

testBrokenLoop('while without body', (c) => {
  while (c()) void(0);
});

testBrokenLoop('for with body', (c) => {
  for (let i = 0; c(); i++) {
    void(0);
  }
});

testBrokenLoop('for without body', (c) => {
  for (let i = 0; c(); i++) void(0);
});

testBrokenLoop('nested infinite for loops', (c) => {
  for (let i = 0; c(); i++) {
    for (let j = 0; c(); j++) {
      void(0);
    }
  }
});

testBrokenLoop('inner infinite for loop', (c) => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; c(); j++) {
      void(0);
    }
  }
});

testBrokenLoop('outer infinite for loop', (c) => {
  for (let i = 0; c(); i++) {
    for (let j = 0; j < 10; j++) {
      void(0);
    }
  }
});

testBrokenLoop('do-while with body', (c) => {
  do {
    void(0);
  } while (c());
});

function testBrokenLoop(message, fn) {
  test(message, (assert) => {
    const startTime = Date.now();
    const fnSource = loopBreaker(`(${fn})`);
    const modifiedFn = eval(fnSource);
    assert.throws(
      () => modifiedFn(() => Date.now() - startTime < 5000),
      /loop broken/i
    );
    assert.end();
  });
}
