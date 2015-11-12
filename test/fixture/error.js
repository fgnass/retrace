function invariant(cond, message) {
  if (!cond) throw new Error(message);
}

function fail(message) {
  invariant(false, message);
}

module.exports = function(message) {
  fail(message);
}
