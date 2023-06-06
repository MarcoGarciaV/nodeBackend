const { model, Schema } = require('mongoose');

const EventSch = Schema({
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, //Reference to User model
        ref: 'User',
        required: true
    }
});

EventSch.method('toJSON', function(){
     const { __v, _id, ...object } = this.toObject();
     object.id = _id;
     return object;
})

module.exports = model('Evento', EventSch);