var http = require('http');
var fs = require('fs');
var child_process = require('child_process');


var getMemInfo = function() {
  var data = fs.readFileSync('/proc/meminfo');
  var regEx = /(\S+):\s+(.+)/g;
  var obj = {};
  var myArray;
  while((myArray = regEx.exec(data)) !== null) {
    obj[myArray[1]] = myArray[2];
  }
  return obj;
}
var getPSAUX = function() {
  var data = child_process.execSync("ps aux");
  if (Buffer.isBuffer(data)) {
    data = data.toString();
  }
  var newData = data.split('\n');
  //newData.forEach(function(element,) )
  return newData;//child_process.execSync("ps aux");
}
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(JSON.stringify(getPSAUX()));
  //res.end(JSON.stringify(getMemInfo()));
}).listen(8080);
