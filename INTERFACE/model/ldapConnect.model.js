var ActiveDirectory = require('activedirectory');
var globalData = require('../../INTERFACE/global/serverConfig');
var configData = require('../global/serverConfig');

var config = {
  url: globalData.ldapServer,
  baseDN: globalData.baseDn
}


class LDAP {

  validateUser(strUserName,strPassword) {
    return new Promise((resolve, reject) => {
      var ad = new ActiveDirectory(config);
      var username = strUserName;//'testing.1@tantrasoftsolutions.com';
      var password = strPassword;//'1234567890';
      var byPassLDAP = configData.byPassLDAP;

      if(byPassLDAP == true)
      {
        resolve({ response: 'Authenticated' });
      }
      else
      {
        ad.authenticate(username, password, function (err, auth) {
          if (err) {
            //resolve('Authentication failed!!');
            resolve({ response: 'Authenticated failed' });
            //console.log('Authentication failed!');
            //console.log('ERROR: ' + JSON.stringify(err));
            //reject(err);
          }
  
          if (auth) {
            resolve({ response: 'Authenticated' });
          }
          else {
            //resolve('Authentication failed!!');
            resolve({ response: 'Authenticated failed' });
            //console.log('Authentication failed!');
          }
        });
      }

    })

  }


}

module.exports = LDAP;
