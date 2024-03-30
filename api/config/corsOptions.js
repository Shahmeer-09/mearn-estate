const allowedOrigins = require('./allowedOrigins')

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true }
    } else {
      corsOptions = { origin: false } 
    }
    callback(null, corsOptions) 
  }

  module.exports = corsOptionsDelegate