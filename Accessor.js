var http = require("http");


var Accessor = (function() {
  function Accessor(port) {
    this.port = port || 9876;
    this.url = "http://localhost:" + this.port;
  }

  Accessor.prototype.ping = function(callback) {
    callback = callback || function() {};
    http.get(this.url + "/ping", function(res) {
      // Waiting for the `end` event seems to require that
      // we first listen to `data` event Otherwise, the
      // callback wont be fired.
      res.on("data", function(){});
      res.on("end", function() {callback(null);});
    }).on("error", function(err) {
      callback(err);
    });
  };

  Accessor.prototype.next = function(callback) {
    callback = callback || function() {};
    http.get(this.url + "/next", function(res) {
      var id = "";
      res.setEncoding("utf8");
      res.on("data", function(data) {id += data;});
      res.on("end", function() {callback(null, id);});
    }).on("error", function(err) {
      callback(err);
    });
  };

  return Accessor;
})();

exports = module.exports = Accessor;
