/**
 * Users routes / Auth
 * host + /api/auth
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');

const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateJwt } = require('../middlewares/validateJwt');

const router = Router();

router.post(
    '/new', 
    [ //midleware
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').not().isEmpty().isEmail(),
        check('password', 'Password should have almost six characters').isLength({ min: 6 }),
        validateFields
    ] , 
    createUser);

router.post('/',
    [
        check('email', 'Email is required').not().isEmpty().isEmail(),
        check('password', 'Password should have almost six characters').isLength({ min: 6 }),
        validateFields
    ],
    loginUser);

router.get('/renew', validateJwt , revalidateToken);

module.exports = router;