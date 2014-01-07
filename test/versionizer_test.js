'use strict';

var versionizer = require('../lib/versionizer.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var emptyHtml = "<html><head><title></title></head><body></body></html>";

exports.testConvertWithNoSrc = function(test) {
	var sameResult = versionizer.convert(emptyHtml);
	test.deepEqual(sameResult, emptyHtml);
  test.done();
}