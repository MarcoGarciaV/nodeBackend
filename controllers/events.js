const { response } = require('express');
const Event = require('../models/Event');


const getEvents = async(req, res = response) => {

    const events = await Event.find().populate('user', 'name');

    res.status(200).json({
        ok: true,
        events
    });
}

const createEvents = async(req, res = response) => {

    const event = new Event( req.body );
    
    try {
        event.user = req.uid;

        const eventSaved = await event.save();

        res.status(201).json({
            ok: true,
            event: eventSaved
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please, go to the administrator'
        });
    }
}

const updateEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventId );

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Event not exist with that id'
            });
        }

        if( event.user.toString() !==  uid){
            return res.status(401).json({
                ok: false,
                msg: 'Do not have permission to edit this event'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.status(201).json({
            ok: true,
            msg: 'update event',
            event: eventUpdated
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please, go to the administrator'
        })
    }
}

const deleteEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById( eventId );

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Event not exist with that id'
            });
        }

        if( event.user.toString() !==  uid){
            return res.status(401).json({
                ok: false,
                msg: 'Do not have permission to delete this event'
            });
        }

        const eventDeleted = await Event.findByIdAndDelete( eventId, { new: true })


        res.status(201).json({
            ok: true,
            msg: 'delete event',
            event: eventDeleted
        });   
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please, go to the administrator'
        })
    }
}

module.exports = {
    getEvents, 
    createEvents,
    updateEvent,
    deleteEvent
}
