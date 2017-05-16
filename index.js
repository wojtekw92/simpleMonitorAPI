var http = require('http');
var fs = require('fs');
var os = require('os');
var child_process = require('child_process');

// Total used memory = MemTotal - MemFree
// Non cache/buffer memory (green) = Total used memory - (Buffers + Cached memory)
// Buffers (blue) = Buffers
// Cached memory (yellow) = Cached + SReclaimable - Shmem
// Swap = SwapTotal - SwapFree
var getMemInfo = function() {
  var data = fs.readFileSync('/proc/meminfo');
  var regEx = /(\S+):\s+(.+)/g;
  var obj = {};
  var myArray;
  while((myArray = regEx.exec(data)) !== null) {
    obj[myArray[1]] = myArray[2];
  }
  var retVal = {
    MemTotal: parseInt(obj.MemTotal, 10),
    TotalMemUsed: parseInt(obj.MemTotal, 10) - parseInt(obj.MemFree, 10),
    NonCacheMem: parseInt(obj.MemTotal, 10) - parseInt(obj.MemFree, 10) - parseInt(obj.Buffers, 10) - parseInt(obj.Cached, 10),
    Buffers:  parseInt(obj.Buffers, 10),
    CachedMem:  parseInt(obj.Cached, 10) + parseInt(obj.SReclaimable, 10) -  parseInt(obj.Shmem, 10),
    SwapTotal: parseInt(obj.SwapTotal, 10),
    SwapUsed: parseInt(obj.SwapTotal, 10) - parseInt(obj.SwapFree, 10),
  }
  return retVal;
}//http://stackoverflow.com/questions/41224738/how-to-calculate-memory-usage-from-proc-meminfo-like-htop

var diskUsage = function() {
  var data = /(\d+%)/g.exec(child_process.execSync('df /'));
  return data[1];
}
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  var obj = {
    memory: getMemInfo(),
    load: os.loadavg(),
    disk: diskUsage(),
    uptime: os.uptime(),
    network: os.networkInterfaces(),
  }
  res.end(JSON.stringify(obj));
}).listen(8080);
