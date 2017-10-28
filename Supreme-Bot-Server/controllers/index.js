var express = require('express');
var router = express.Router();

// router.get('/', function(req, res) {
// 	var someBigString = 'Default page' + 1;
// 	someBigString += '<br>';
//   	res.send(someBigString);
// })

router.get('/hello', function(req, res) {
  res.send('The hello page!!');
})

module.exports = router;
