const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt')

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if( user ){
            return res.status(400).json({
                ok: false,
                msg: 'An user exists with this email: ' + email
            })
        }

        user = new User( req.body )

        //Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        //Generate JWT Json Web Token
        const token = await generateJWT( user.id, user.name );


        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please, go to the administrator'
        })
    }
}

const loginUser = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if( !user ){
            return res.status(400).json({
                ok: false,
                msg: 'The user does not exist with that email'
            })
        }

        //Confirm passwords
        const validPassword = bcrypt.compareSync( password, user.password );

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Incorrect password'
            })
        }

        //Generate JWT Json Web Token
        const token = await generateJWT( user.id, user.name );


        res.status(201).json({
            ok: true,
            msg: 'login',
            email,
            password,
            token
        })   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please, go to the administrator'
        })
    }
}

const revalidateToken = async (req, res = response) => {
    const { uid, name } = req;

    //Generatea new JWT and return in this request
    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}