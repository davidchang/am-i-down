var schemas = require('./mongo');

module.exports.setRoutes = function(app, passport) {
    /* AUTHENTICATION */
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/#/main',
        failureRedirect: '/#/login' }));

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
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
        schemas.List.find({ userId: req.user.id }, function(error, data) {
            if(error) {
                console.log(error);
                res.end(JSON.stringify({ error: error }));
            }
            console.log('returning from get /lists');
            console.log(data);
            res.end(JSON.stringify(data));
        });
    });

    app.post('/lists', function(req, res) {
        console.log("RECEIVED LISTS: ");
        console.log(req.body.lists);

        var lists = new schemas.List({
            userId: req.user.id,
            lists: lists
        });

        lists.save(function(err, lists) {
            if(err)
                console.log(err);
        });
    });

    app.get('/mood', function(req, res) {
        schemas.Mood.find({ userId: req.user.id }, function(error, data) {
            if(error) {
                console.log(error);   
                return;
            }

            res.writeHead(200, { "Content-Type" : 'text/plain' });
            console.log(data);
            res.end(JSON.stringify(data));
        });
    });

    app.post('/mood', function(req, res) {
        console.log("RECEIVED THIS SET OF MOODS: " + req.body.mood);
        var mood = new schemas.Mood({
            userId: req.user.id,
            mood: req.body.mood
        });

        mood.save(function(err, mood) {
            if(err)
                console.log(err);
        });
    });
}
