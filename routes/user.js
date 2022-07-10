const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/', (req, res) => {
    res.send('user route');
})

// UPDATE USER
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                res.status(500).send({
                    error,
                    detail: 'internal server error'
                })
            }
        }
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json(" account has been updated ")
        } catch (error) {
            res.status(500).send({
                error,
                detail: 'internal server error'
            })
        }
    } else {
        res.status(403).json(" you can update only your account ")
    }
})

// DELETE USER
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json(" account has been deleted ")
        } catch (error) {
            res.status(500).send({
                error,
                detail: 'internal server error'
            })
        }
    } else {
        res.status(403).json(" you can delete only your account ")
    }
})

//GET USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, createdAt, ...others } = user._doc
        res.status(200).send([
            others,
            {
                code: 'SUCCESS',
                detail: 'user found successfully'
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