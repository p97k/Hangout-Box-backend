const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// REGISTER USER
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        if (req.body.password.length < 8) {
            res.status(400).send({
                code: 'FAILED',
                detail: 'password must be longer than 8 character'
            })
        }
        if (req.body.username.length < 5) {
            res.status(400).send({
                code: 'FAILED',
                detail: 'username must be longer than 5 character'
            })
        }
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            profile_image: req.body.profile_image,
            cover_image: req.body.cover_image,
            followers: req.body.followers,
            followings: req.body.followings,
            isAdmin: req.body.isAdmin
        })

        const user = await newUser.save();
        res.status(200).send([
            user,
            {
                code: 'SUCCESS',
                detail: 'successfully registerd'
            }
        ])
        
    } catch (error) {
        res.status(500).send({
            error,
            detail: 'internal server error'
        })
    }
})

// LOGIN USER
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send({
            code: 'FAILED',
            detail: 'user not found'
        });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).send({
            code: 'FAILED',
            detail: 'wrong password'
        });

        res.status(200).send([
            user,
            {
                code: 'SUCCESS',
                detail: 'successfully loged in'
            }
        ])

    } catch (error) {
        res.status(500).send({
            error,
            detail: 'internal server error'
        })
    }
})

module.exports = router;