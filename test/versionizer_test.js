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
var scriptAndCssWithOutVersion = '<script type="text/javascript" src="a.js"></script>' +
	'<link rel="stylesheet" type="text/css" href="b.css"/>';
var scriptHasVersion = '<script type="text/javascript" src="c.js?v=1389259582261"></script>';


exports.testConvert_WithNoSrc = function(test) {
	var sameResult = versionizer.convert(emptyHtml);
	test.deepEqual(sameResult, emptyHtml);
	test.done();
};

exports.testConvert_WithBothScriptAndCss_WithOutVersion = function(test) {
	var result = versionizer.convert(scriptAndCssWithOutVersion);
	var src = result.substring(result.indexOf('src="') + 5, result.indexOf('">'));
	var href = result.substring(result.indexOf('href="') + 6, result.length - 2);

	test.notDeepEqual(src.indexOf("?v="), -1);
	test.notDeepEqual(href.indexOf("?v="), -1);

	var versionLength = Date.now().toString().length;
	var srcVersion = src.substring(src.indexOf("=") + 1);
	var hrefVersion = href.substring(href.indexOf("=") + 1);

	test.deepEqual(srcVersion.length, versionLength);
	test.deepEqual(hrefVersion.length, versionLength);
	test.done();
};

exports.testConvert_WithVersionAlready = function(test) {
	var result = versionizer.convert(scriptHasVersion);
	var version = "1389259582261";
	var newVersion = result.substring(result.indexOf("c.js?v=") + 7, result.indexOf('"></script>'));

	test.deepEqual(newVersion.length, version.length);
	test.notDeepEqual(newVersion, version);
	test.done();
};