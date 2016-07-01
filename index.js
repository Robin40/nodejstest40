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

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
