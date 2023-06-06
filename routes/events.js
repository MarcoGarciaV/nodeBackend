/**
 * Events routes / events
 * host + /api/events/
 */

const { Router } = require('express');
const { getEvents, createEvents, updateEvent, deleteEvent } = require('../controllers/events');
const { validateJwt } = require('../middlewares/validateJwt');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.use(validateJwt);

//get events
router.get('/',getEvents );

//create new events
router.post('/',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start Date is required').isDate(),
        check('end', 'End Date is required').isDate(),
        validateFields
    ],
    createEvents );

// update event
router.put('/:id', 
    [ 
    check('title', 'Title is required').not().isEmpty(),
    check('start', 'Start Date is required').isDate(),
    check('end', 'End Date is required').isDate(),
    validateFields
    ]
 , updateEvent);

//delete event
router.delete('/:id', deleteEvent );

module.exports = router;