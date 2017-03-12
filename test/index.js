import test from 'tape';
import {spawn} from 'child_process';
import loopBreaker from '../src/';

const A_LOT = 10000000000;

/*
*/
testBrokenLoop('while with body', () => {
  var i = 0;
  while (i < A_LOT) {
    i++;
  }
});

testBrokenLoop('while without body', () => {
  var i = 0;
  while (i < A_LOT) i++;
});

testBrokenLoop('for with body', () => {
  for (var i = 0; i < A_LOT; i++) {
  }
});

testBrokenLoop('for with body', () => {
  for (var i = 0; i < A_LOT; i++) i *= 1;
});

function testBrokenLoop(message, fn) {
  test(message, (assert) => {
    const fnSource = loopBreaker(fn.toString());
    const modifiedFn = eval(fnSource);
    assert.throws(() => modifiedFn(), /loop broken/i);
    assert.end();
  });
}
