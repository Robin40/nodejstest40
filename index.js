var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
	res.send('Hello World!');
})

app.get('/api/pdf2text', function(req, res) {
	res.send("in: " + req.query['in']);
})

app.get('/test/staticfile', function(req, res) {
	output = "";
	app.use(express.static(__dirname + '/static'));
	var filename = __dirname + '/static' + '/' + req.query['in'] + '.pdf';
	//res.sendfile(__dirname + '/static' + '/' + req.query['in'] + '.pdf');
	//res.end;
	require('pdfjs-dist');
	var fs = require('fs');
	var data = new Uint8Array(fs.readFileSync(filename));
	PDFJS.getDocument(data).then(function (pdfDocument) {
		output += "Number of pages: " + pdfDocument.numPages + '\n';
	});
	res.send(output);
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
