var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const typeEnum = ["Person", "Coaching"];

var followupSchema = mongoose.Schema({
    type: { type: String, enum: typeEnum, required: true},
    name: {type: String, required: true},
    phone: {type: String}, //array
    email: {type: String}, //array
    nextFollowAt: {type: Date},
    comment: {type: String},
    complete: {type: Boolean, default: false},
    referredBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'followup'}],
    relatedTo: [{type: mongoose.Schema.Types.ObjectId, ref: 'followup'}], //if you want to link student followup and coaching followup
    _created: {type: Date, default: new Date()}
    //coachingId
    //userId
});

followupSchema.plugin(deepPopulate);

module.exports = mongoose.model('followup', followupSchema);
