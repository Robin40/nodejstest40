var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
	res.send('Hello World!');
})

app.get('/api/pdf2text', function(req, res) {
	var staticDir = __dirname + '/static';
	var filename = staticDir + '/' + req.query.in + '.pdf';
	app.use(express.static(staticDir));
	require('pdfjs-dist');
	var fs = require('fs');
	var data = new Uint8Array(fs.readFileSync(filename));
	
	var textArray;
	PDFJS.getDocument(data).then(function (pdf) {
		textArray = new Array(pdf.numPages);
		
		var page2txt = function (pageNum) {
			return pdf.getPage(pageNum).then(function (page) {
				return page.getTextContent().then(function (content) {
					var strings = content.items.map(function (item) {
						return item.str;
					});
					console.log('loadPage ' + pageNum);
					textArray[pageNum-1] = strings.join(' ');
				});
			});
		};
		
		var promiseChain = Promise.resolve();
		for (var pageNum = 1; pageNum <= pdf.numPages; ++pageNum)
			promiseChain = promiseChain.then(page2txt.bind(null, pageNum));
		return promiseChain;
	})
	.then(function () {
		var output = "";
		output += "El texto es:\n";
		output += textArray.join('\n----\n');
		res.send(output);
	});
})

app.get('/test/staticfile', function(req, res) {
	var output = "";
	app.use(express.static(__dirname + '/static'));
	var filename = __dirname + '/static' + '/' + req.query['in'] + '.pdf';
	//res.sendfile(__dirname + '/static' + '/' + req.query['in'] + '.pdf');
	//res.end;
	require('pdfjs-dist');
	var fs = require('fs');
	var data = new Uint8Array(fs.readFileSync(filename));
	PDFJS.getDocument(data).then(function (pdfDocument) {
		output += "Number of pages: " + pdfDocument.numPages + '\n';
		res.send(output);
	});
})

app.get('/test/consolelog', function(req, res) {
	console.log("le foo");
	res.send("foo");
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
