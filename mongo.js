var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error:'));
db.once('open', function callback () {
      // yay!
});

//USER
var userSchema = mongoose.Schema({
    name: String,
    email: String,
    username: String,
    provider: String,
    facebook: mongoose.Schema.Types.Mixed,
    twitter: mongoose.Schema.Types.Mixed
});

var User = mongoose.model('User', userSchema);

//LIST
var listSchema = mongoose.Schema({
    lists: [{
            name: String,
            startDate: { type: Date, default: Date.now },
            days: [{
                realTime: Number,
                dayTime: Number,
                good: Boolean   
            }],
            notes: [{
                realTime: Number,
                dayTime: Number,
                text: String
            }],
            public: { type: Boolean, default: false }
        }
    ],
    userId: String
});

var List = mongoose.model('List', listSchema);

var relationshipSchema = mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    userHoldingName: String,
    userHoldingId: String,
    userHeldName: String,
    userHeldId: String
});

var Relationship = mongoose.model('Relationship', relationshipSchema);

module.exports = {
    User: User,
    List: List,
    Relationship: Relationship
}
