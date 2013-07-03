var schemas = require('./mongo'),
  _ = require('underscore'),
  utils = require('./utils');

module.exports.setRoutes = function(app, passport) {
    /* AUTHENTICATION */
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/#/main',
        failureRedirect: '/#/login' }));

    app.get('/logout', function(req, res){
        req.session.invited = null;
        req.logout();
        res.redirect('/#/login');
    });

    /* REST */
    app.get('/user', function(req, res) {
        res.writeHead(200, { "Content-Type" : 'text/plain' });
        if(req.session.invited) {
          var decodedUserId = req.session.invited;
          schemas.User.findById(decodedUserId, function(err, doc) {
            var toReturn =  {};
            toReturn['user'] = req.user;
            //if(doc.id != req.user.id)
              toReturn['invite'] = { name: doc.name };

            res.end(JSON.stringify(toReturn));
          });
        }
        else {
          res.end(JSON.stringify({ user: req.user }));
        }
    });

    app.get('/lists', function(req, res) {

      var forSpecificUser = req.query ? req.query.userId : null;
      console.log("SPECIFIC USER:");
      console.log(forSpecificUser);

      res.writeHead(200, { "Content-Type" : 'text/plain' });
      //must be authenticated
      if(!req.user.id) {
        res.end('{}');
        return;
      }
      if(!forSpecificUser) {
        schemas.List.findOne({ userId: req.user.id }, function(error, data) {
          if(error) {
            console.log(error);
            res.end(JSON.stringify({ error: error }));
            return;
          }
          res.end(JSON.stringify(data));
        });
      }
      else {
        //the current req.user must be able to view forSpecificUser's metrics
        schemas.Relationship.findOne( { userHeldId: forSpecificUser, userHoldingId: req.user.id }, function(error, data) {
          if(error) {
            console.log(error);
            res.end(JSON.stringify({ error: error }));
            return;
          }

          if(!data) {
            console.log("Relationship does not exist");
            res.end(JSON.stringify({ error: "That relationship does not exist" }));
            return;
          }

          var name = data.userHeldName;

          schemas.List.findOne({ userId: forSpecificUser }, function(error, data) {
            if(error) {
              console.log(error);
              res.end(JSON.stringify({ error: error }));
              return;
            }
            var toReturn = {};
            toReturn['name'] = name;
            //TODO remove !public ones from data.lists
            toReturn['lists'] = data.lists;
            res.end(JSON.stringify(toReturn));
          });

        });
      }
    });

    app.post('/lists', function(req, res) {
      schemas.List.update({ userId: req.user.id }, {
          userId: req.user.id,
          lists: req.body.lists
      }, { upsert: true }, function(err) {
          if(err)
              console.log(err);
      });
    });

    app.post('/invitation', function(req, res) {
      if(req.body.accepted) {
        schemas.User.findById(req.session.invited, function(err, doc) {
          if(err) {
            res.writeHead(200, { "Content-Type" : 'text/plain' });
            res.end(JSON.stringify({ error: err }));
            return;
          }

          var relationship = new schemas.Relationship({
            userHoldingId: req.user.id,
            userHoldingName: req.user.name,
            userHeldId: req.session.invited,
            userHeldName: doc.name
          });

          relationship.save(function(err) {
            res.writeHead(200, { "Content-Type" : 'text/plain' });
            if(err)
              res.end(JSON.stringify({ error: err }));
            else {
              req.session.invited = null;
              res.end(JSON.stringify({ success: true }));
            }
          });
        });
      }
      else {
        req.session.invited = null;
        res.writeHead(200, { "Content-Type" : 'text/plain' });
        res.end(JSON.stringify({ success: true }));
      }
    });

    /* INVITATION ROUTES */

    app.get('/user/inviteLink', function(req, res) {
      res.writeHead(200, { "Content-Type" : 'text/plain' });

      if(!req.user.id) {
        res.end('');
        return;
      }

      res.end(utils.encryptInviteLink(req.user.id));
    });

    app.get('/invite/:encoded', function(req, res) {
      
      var decodedUserId = utils.decryptInviteLink(req.params.encoded);

      schemas.User.findById(decodedUserId, function(err, doc) {
        if(!err) {
          req.session.invited = decodedUserId;
        }

        res.redirect('/#/login');
      });
        
    });

    app.get('/user/accountabilityPartners', function(req, res) {
      res.writeHead(200, { "Content-Type" : 'text/plain' });

      var toReturn = {};
      schemas.Relationship.find({ userHeldId: req.user.id }).exec(function(err, data) {
        if(err) {
          res.end('{}');
          return;
        }
        toReturn['held'] = data;
        schemas.Relationship.find({ userHoldingId: req.user.id }).exec(function(err, data) {
          if(err) {
            res.end('{}');
            return;
          }
          toReturn['holding'] = data;

          res.end(JSON.stringify(toReturn));
        });
      });

    });
}
