var config = require('./config'),
  utils = {};

utils.encryptInviteLink = function(userId) {
  var encoded = new Buffer(config.SALTforInviteLinks + config.delimiterForInviteLinks + userId).toString('base64');
  return 'http://localhost:3000/invite/' + encoded;
}

utils.decryptInviteLink = function(encoded) {
  var decodedUserId = new Buffer(encoded, 'base64').toString('ascii');
  var splitPieces = decodedUserId.split(config.delimiterForInviteLinks);
  if(splitPieces.length > 1)
    return splitPieces[1];
  return '';
}

module.exports = utils;
