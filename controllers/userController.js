'use strict'

const express = require('express');

const gravatar = require('gravatar');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const config = require('config')

const User = require('../models/User')

const OauthAccessToken = require('../models/oauthAccessToken')

const { validationResult } = require('express-validator');

// const uuidv4 = require('uuid/v4');

const moment = require('moment');


// const WebPage = require('../models/webPage')







/**
 * Controller method to create user with email and password
 *
 * @param String email
 * @param String password
 *
 * @returns Bearer Token
 */
exports.createUser = async (req , res) => {

    let errors = validationResult(req);
    console.log(errors);
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    let {name , email , password} = req.body

    try{

        let user = await User.findOne({email});

        if(user){
            res.status(400).json({ errors: [{message: 'User Already Exists'}] });
        }

        const avatar = gravatar.url(email , {
            // s => Default size set to string of 200
            // r => rating so we don't get any naked people or anything adult
            // d => give a default image
            s: "200" ,
            r: "pg" ,
            d: "mm"
        })

        user = new User({
            name,
            email,
            avatar,
            password,
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password , salt);

        await user.save();

        const payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(
            payload ,
            process.env.SECRET_KEY,
            {expiresIn : 3600000} ,
            (err , token) => {
                if(err) throw err ;
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    access_token : token,
                    token_type : 'Bearer',
                    expiration : moment().add(300, 'days').unix()
                })
            });

    }catch(error){
        console.log(error.message)
        return res.status(500).send('Server Error');

    }


}


/**
 * Controller method to login user with email and password
 *
 * @param String email
 * @param String password
 *
 * @returns JSON response
 */
exports.login = async(req, res) => {

    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email , password} = req.body

    try{

        let user = await User.findOne({email});

        if(!user){
            res.status(400).json({ errors: [{message: 'User Not Found'}] });
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){
            res.status(400).json({ errors: [{message: 'Invalid Credentials'}] });
        }

        // let uuid = uuidv4()

        let access_token = new OauthAccessToken({
            user_id: user.id ,
            name: "Express CMS",
            scopes: '[*]',
            revoked: 0,
            expires_at: moment().add(300, 'days')
        });
    
        await access_token.save();

        let payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(
            payload ,
            config.get('jwtSecretKey'),
            {expiresIn : 3600000} ,
            (err , token) => {
                if(err) throw err ;
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    access_token : token,
                    token_type : 'Bearer',
                    expiration : moment().add(300, 'days').unix()
                })
            });

    }catch(error){
        console.log(error.message)
        res.status(500).send('Server Error');

    }
    // try {

    //    
    //         if (result == true) {
    //             let uuid = uuidv4()
               
    //             let data = await db.OauthAccessToken.create({
    //                 id: uuid,
    //                 user_id: userData.id,
    //                 name: "POV",
    //                 scopes: '[*]',
    //                 revoked: 0,
    //                 expires_at: moment().add(300, 'days')
    //             })

                
                
    //             let payload = { id: uuid };

    //             let jwtOptions = {};

    //             jwtOptions.secretOrKey = process.env.SECRET_KEY;

    //             let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '300 days' });

    //            
    //         } else {
                
    //             res.status(401).json({ message: 'user credentials were incorrect' });
    //         }
    //     });
    // } catch(exception) {
        
    //     res.status(500).json({ message: 'SERVER ERROR' });
    // }

}

/**
 * Controller method to retrieve currently authenticated user
 *
 * @returns JSON response
 */
exports.me = async(req, res) => {
    return res.status(200).json({
        user: req.userData
    });
}



   


   

