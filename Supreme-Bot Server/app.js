
var express = require('express');
var path = require('path')
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
var PythonShell = require('python-shell');
var router = express.Router();

app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/'));
app.use('/api', router);

// const corsOptions = {
//   origin: 'https://risktyle.com'
// }
//
// app.use(cors(corsOptions))
//
// app.use(cors())

app.use(require('./controllers'));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Pass to next layer of middleware
    next();
});

app.set('port', process.env.PORT || 8080);

var listener = app.listen(app.get('port'), function() {
  console.log( listener.address().port );
});

router.route('/supreme')
.get(function(req,res){
  var options = {
    //{"categories": 'accessories', "model": 'tagless hanes tee', "color":'black',"size":'medium'}
    args: ['accessories','tagless hanes tee','black','medium']
  }
  PythonShell.run('python/supremenewyork_v3.py', options, function (err, results) {
      if (err) throw err
      res.send({'url':results})
    });
})
.post(function(req,res){
  var data = req.body.data;
  var options = {
    //args: ['accessories','tagless hanes tee','black','medium']
    args: [data.categories, data.model, data.color, data.size]
  }
  PythonShell.run('python/supremenewyork_v3.py', options, function (err, results) {
      if (err){
        //console.log(err);
        res.json({'url': ["error"]})
      }
      else{
        res.json({'url':results})
      }
    });
});
