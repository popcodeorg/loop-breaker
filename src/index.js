import recast from 'recast';

const types = recast.types;
const n = types.namedTypes;
const b = types.builders;

const loopBreaker = recast.parse(`var __loopBreaker = (function() {
  var count = 0;
  var startTime;
  return function() {
    startTime || (startTime = Date.now());
    count += 1;
    if (count > 10000 && (Date.now() - startTime > 1000)) {
      throw new Error("Loop Broken!");
    }
  };
}());\n`).program.body;

const check = recast.parse(`__loopBreaker();`).program.body;

function fixLoop(loop) {
  if (n.BlockStatement.check(loop.body)) {
    loop.body.body = check.concat(loop.body.body);
  } else {
    loop.body = b.blockStatement([...check, loop.body]);
  }
}

export default function(str) {
  const ast = recast.parse(str);
  ast.program.body = loopBreaker.concat(ast.program.body);
  recast.visit(ast, {
    visitWhileStatement(loop) {
      fixLoop(loop.node);
      this.traverse(loop);
    },

    visitForStatement(loop) {
      fixLoop(loop.node);
      this.traverse(loop);
    }
  });
  return recast.print(ast).code;
}
