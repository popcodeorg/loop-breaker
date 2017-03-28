import recast from 'recast';

const types = recast.types;
const n = types.namedTypes;
const b = types.builders;

const loopBreaker = recast.parse(`var __loopBreaker = (function() {
  var loops = {};

  return {
    check: function(i) {
      if (!loops[i]) {
        loops[i] = {startTime: Date.now(), count: 0}
      }
      var loop = loops[i];

      if (loop.safe) {
        return;
      }

      loop.count += 1;
      if (loop.count > 10000 && (Date.now() - loop.startTime > 1000)) {
        throw new Error("Loop Broken!");
      }
    },

    markSafe: function(i) {
      if (!loops[i]) {
        loops[i] = {};
      }

      loops[i].safe = true;
    }
  };
}());\n`).program.body;

function fixLoop({node, parentPath}, i) {
  const check = recast.parse(`__loopBreaker.check(${i});`).program.body;
  const markSafe = recast.parse(`__loopBreaker.markSafe(${i});`).program.body;
  if (n.BlockStatement.check(node.body)) {
    node.body.body = check.concat(node.body.body);
  } else {
    node.body = b.blockStatement([...check, node.body]);
  }
  parentPath.replace([...parentPath.value, ...markSafe]);
}

export default function(str) {
  const ast = recast.parse(str);
  let i = 0;
  ast.program.body = loopBreaker.concat(ast.program.body);
  recast.visit(ast, {
    visitWhileStatement(loop) {
      fixLoop(loop, i++);
      this.traverse(loop);
    },

    visitForStatement(loop) {
      fixLoop(loop, i++);
      this.traverse(loop);
    },

    visitDoWhileStatement(loop) {
      fixLoop(loop, i++);
      this.traverse(loop);
    }
  });
  return recast.print(ast).code;
}
