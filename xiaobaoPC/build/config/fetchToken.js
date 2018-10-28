const server = require("./server.config.js");
var page = require('webpage').create(),
	system = require('system'),
	fs = require('fs');

var url = server.target;
var user = system.args[1];
var fname = system.args[2];

page.open(url, function() {
	page.includeJs("https://oa.sogou-inc.com/pub/htdocs/lib/jquery-2.1.1/jquery-2.1.1.min.js", function() {
		page.evaluate(function(user) {
			$("#tabForm").click()
			$("#userName").val(user);
			$("#password").val("debug");
			$("#formSubmit").click();
		}, user);
		window.setTimeout(function() {
			var content = "module.exports = {\n";
			var cookies = page.cookies;
			for(var i in page.cookies) {
				content += '  ' + cookies[i].name + ': \'' + cookies[i].value + '\',\n'
			}
			content += "}";
			fs.write(fname, content, 'w');
			phantom.exit();
		}, 500);
	});
});