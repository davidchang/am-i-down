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
        console.log(req.user);
        res.end(JSON.stringify(req.user));
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
}
