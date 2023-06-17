const serverConfig = require('./serverConfig');
const requestIP = require('request-ip')


module.exports = function Networklogs(req, res, next) {

    var prev_end = res.end
  
    if (req.url.endsWith('/getIDSNo')) {
      var Ip = requestIP.getClientIp(req)
      console.log('TSH-IP => ', Ip)
    }
  
    console.log("request-url => ", serverConfig.HOST_IP + ':' + serverConfig.INTERFACE_NO + req.url)
    // console.log("request-body => ", JSON.stringify(req.body))
  
     var chunks = [];
     res.end = (...restArgs) => {
      if (restArgs[0]) {
        chunks.push(Buffer.from(restArgs[0]));
      }
      const body = Buffer.concat(chunks).toString('utf8');
  
      // console.log("response-body => ", body)
  
      prev_end.apply(res, restArgs);
  
    }
  
    next()
  
  }