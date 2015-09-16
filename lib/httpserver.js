'use strict';

let http = require('http');
let fs = require('fs');
let path = require('path');

let mimeTypes = require('./mimeTypes');
let port = 2805;

let requestHandler = (req, res) => {
	let url = req.url;
	let filePath = path.join(__dirname, url);
	console.log(req.method + ' ' + url + ' ' + filePath);

	fs.exists(filePath, exists => {
		if (!exists) {
			res.statusCode = 404;
			res.end('not found'); // or do this: filePath = '404.html';
			return;
		}

		let ext = path.extname(filePath);
		let contentType = mimeTypes[ext] || 'text/html';
		fs.stat(filePath, (err, stat) => {
			if (err) {
				console.log(err);
				res.end(err.toString());
				return;
			}
			res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': stat.size });

			let readStream = fs.createReadStream(filePath);
			readStream.pipe(res);
		});

	});
};

let server = http.createServer(requestHandler);
server.listen(port);
console.log(`server is started and is listening on port ${port}`);