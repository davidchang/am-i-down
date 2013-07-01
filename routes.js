var schemas = require('./mongo');

module.exports.setRoutes = function(app, passport) {
    /* AUTHENTICATION */
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/#/main',
        failureRedirect: '/#/login' }));

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/#/login');
    });

    /* REST */
    app.get('/user', function(req, res) {
        res.writeHead(200, { "Content-Type" : 'text/plain' });
        var toReturn = req.user;
        if(req.user && req.session.invited) {
          console.log('including ' + req.session.invited);
          console.log(toReturn);
          toReturn['session'] = req.session.invited;
          console.log(toReturn);
        }

        res.end(JSON.stringify(toReturn));
    });

    app.get('/lists', function(req, res) {
        res.writeHead(200, { "Content-Type" : 'text/plain' });
        schemas.List.findOne({ userId: req.user.id }, function(error, data) {
            if(error) {
                console.log(error);
                res.end(JSON.stringify({ error: error }));
                return;
            }
            res.end(JSON.stringify(data));
        });
    });

    app.post('/lists', function(req, res) {
      console.log(req.body.lists);
        schemas.List.update({ userId: req.user.id }, {
            userId: req.user.id,
            lists: req.body.lists
        }, { upsert: true }, function(err) {
            if(err)
                console.log(err);
        });
    });

    /* INVITATION ROUTES */

    app.get('/user/inviteLink', function(req, res) {
      res.writeHead(200, { "Content-Type" : 'text/plain' });

      if(!req.user.id) {
        res.end('');
        return;
      }

      var encoded = new Buffer(req.user.id).toString('base64');
      res.end('http://localhost:3000/invite/' + encoded);
    });

    app.get('/invite/:encoded', function(req, res) {
      
      var encoded = req.params.encoded;
      var decodedUserId = new Buffer(encoded, 'base64').toString('ascii');

      schemas.User.findById(decodedUserId, function(err, doc) {
        if(!err) {
          console.log('just set req.session.invited');
          req.session.invited = decodedUserId;
        }

        res.redirect('/#/login');
      });
        
    });
}
