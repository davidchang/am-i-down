var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error:'));
db.once('open', function callback () {
      // yay!
});

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    username: String,
    provider: String,
    facebook: mongoose.Schema.Types.Mixed,
    twitter: mongoose.Schema.Types.Mixed
});

var User = mongoose.model('User', userSchema);

/*
var moodSchema = mongoose.Schema({
    userId: String,
    date: { type: Date, default: Date.now },
    mood: {
        type: String,
        value: Number
    }
});

var Mood = mongoose.model('Mood', moodSchema);

var eventSchema = mongoose.Schema({
    userId: String,
    date: { type: Date, default: Date.now },
    text: String
});

var Event = mongoose.model('Event', eventSchema);
*/

module.exports = {
    User: User
}
