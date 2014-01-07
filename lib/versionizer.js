var cheerio = require("cheerio"),
	extend = require("util")._extend;

var tag = Date.now();
var convert = function(content) {
	var copy = content;
	var $ = cheerio.load(copy);
	//deal with script
	$("script").each(function(i, elem) {
		var $this = $(this);
		var src = $this.attr("src");

	});
	//deal with csslink

	return copy;
};


module.exports = {
	convert: convert,
	convertOne: function(input, ouput) {},
	convertAll: function() {}
};