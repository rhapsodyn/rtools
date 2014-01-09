var cheerio = require("cheerio"),
	url = require("url"),
	extend = require("util")._extend,
	fs = require("fs"),
	rsvp = require("rsvp");

var tag = Date.now();
var convert = function(content) {
	var $ = cheerio.load(content);
	var getNewVersionUrl = function(oldUrl) {
		var urlCopy = extend({}, oldUrl);
		if (!urlCopy.query) {
			urlCopy.query = {
				v: tag
			};
		} else {
			urlCopy.query.v = tag;
			urlCopy.search = null; //see url.format's doc
		}
		return url.format(urlCopy);
	};

	//deal with script
	$("script").each(function() {
		var $this = $(this);
		if ($this.attr("src")) {
			var srcUrlObj = url.parse($this.attr("src"), true);
			$this.attr("src", getNewVersionUrl(srcUrlObj));
		}
	});
	//deal with csslink
	$("link").each(function() {
		var $this = $(this);
		if ($this.attr("href")) {
			var hrefUrlObj = url.parse($this.attr("href"), true);
			$this.attr("href", getNewVersionUrl(hrefUrlObj));
		}
	});

	return $.html();
};
var endsWith = function(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

module.exports = {
	convert: convert,
	convertOne: function(input, output) {
		output = input;
		throw "NotImplementException";
	},
	convertAll: function() {
		var outputPath = "output/";
		if (!fs.existsSync(outputPath)) {
			fs.mkdir(outputPath);
		}

		var readAllFile = new rsvp.Promise(function(resolve, reject) {
			fs.readdir(process.cwd(), function(err, filenames) {
				if (err) {
					reject(err);
				} else {
					resolve(filenames);
				}
			});
		});
		var readHtml = function(filename) {
			return new rsvp.Promise(function(resolve, reject) {
				if (endsWith(filename, ".html") || endsWith(filename, ".htm")) {
					console.log("read: " + filename);
					fs.readFile(filename, function(err, data) {
						if (err) {
							reject(err);
						} else {
							resolve({
								filename: filename,
								data: convert(data)
							});
						}
					});
				} else {
					resolve(); // with undefined
				}
			});
		};
		var writeToOutput = function(filename, data) {
			return new rsvp.Promise(function(resolve, reject) {
				fs.writeFile(outputPath + filename, data, function(err) {
					if (err) {
						reject(err);
					} else {
						resolve(filename);
					}
				});
			});
		};

		rsvp.on("error", function(event) {
			console.error(event);
		});

		//even with promises, still shitty 
		readAllFile.then(function(filenames) {
			filenames.forEach(function(filename) {
				readHtml(filename).then(function(value) {
					if (value) {
						return writeToOutput(value.filename, value.data);
					}
				}).then(function(filename) {
					if (filename) {
						console.log(filename + " done");
					}
				});
			});
		});
	}
};