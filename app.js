var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var exec = require('child_process').exec;
var moment = require("moment");

var colorRed = '\u001b[31m';
var colorGreen = '\u001b[32m';
var colorReset   = '\u001b[0m';

http.createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});

	var folder = request.url.substr(1);

	if (request.method == 'POST') {
		var body = '';

		request.on('data', function(data) {
			body += data;
		});
		request.on('end', function() {

	fs.exists(folder, function(exists) {
		if (exists) {
			var post = qs.parse(body);
			var command = 'cd ' + folder + '; grunt deploy;';
			var child = exec(command, function(err, stdout, stderr) {
				console.log(colorGreen + moment().format("YYYY-MM-DD HH:mm:ss") + colorReset + ' deploy finish', folder);	
			});
			response.end(folder+' start.\n');
			console.log(colorGreen + moment().format("YYYY-MM-DD HH:mm:ss") + colorReset + ' deploy start', folder);
		} else {
			response.end('error\n');
		}
	});
		});
	} else {
		response.end('error\n');
	}
}).listen(9000);
console.log(colorRed + 'Server running port 9000' + colorReset);