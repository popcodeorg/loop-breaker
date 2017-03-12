import recast from 'recast';

const types = recast.types;
const n = types.namedTypes;
const b = types.builders;

const loopBreaker = recast.parse(`var __loopBreaker = (function() {
  var loops = {};
  return function(i) {
    if (!loops[i]) {
      loops[i] = {startTime: Date.now(), count: 0}
    }
    var loop = loops[i];
    loop.count += 1;
    if (loop.count > 10000 && (Date.now() - loop.startTime > 1000)) {
      throw new Error("Loop Broken!");
    }
  };
}());\n`).program.body;

function fixLoop(loop, i) {
  const check = recast.parse(`__loopBreaker(${i});`).program.body;
  if (n.BlockStatement.check(loop.body)) {
    loop.body.body = check.concat(loop.body.body);
  } else {
    loop.body = b.blockStatement([...check, loop.body]);
  }
}

export default function(str) {
  const ast = recast.parse(str);
  let i = 0;
  ast.program.body = loopBreaker.concat(ast.program.body);
  recast.visit(ast, {
    visitWhileStatement(loop) {
      fixLoop(loop.node, i++);
      this.traverse(loop);
    },

    visitForStatement(loop) {
      fixLoop(loop.node, i++);
      this.traverse(loop);
    },

    visitDoWhileStatement(loop) {
      fixLoop(loop.node, i++);
      this.traverse(loop);
    }
  });
  return recast.print(ast).code;
}
