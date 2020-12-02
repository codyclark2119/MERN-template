const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Destructuring out the functions from express-validator
const {
    check,
    validationResult
} = require('express-validator');

// A function for checking the headers of a request for a token
const auth = require('../../middleware/auth');
// Reference to the User schema
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Authentication check route
// @access  Public

// The auth function is called to check the user token to set the req.user value
router.get('/', auth, async (req, res) => {
    try {
        // Searching for a user by the value from the token and getting all info EXCEPT the password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user login
// @access  Public
router.post('/', 
    // Passing an array to express-validator to check the req.body for validations
    // https://express-validator.github.io/docs/
    [
        // Checking req.body for a email property and setting a message to respond with if there isnt one
        check('email', 'Please include a valid email')
            .isEmail(),
        check('password', 'Password is required')
            .exists()
    ],
    // Setting async for proper asynchronus requests
    async (req, res) => {
        // Checking the result of the express-validator
        const errors = validationResult(req);
        // If there is an error, respond with it
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        // Since there was no error, destruture req.body for the values needed for the user
        const {
            email,
            password
        } = req.body;
        // Setting the try block for the await sections
        try {
            // Checking the database for an existing matching email
            let user = await User.findOne({
                email
            })
            // If there is no existing user then error as the credentials are invalid
            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid Credentials'
                    }]
                });
            }
            // Checking the stored encrypted password with the password provided (Returns a boolean)
            // https://www.npmjs.com/package/express-validator
            const isMatch = await bcrypt.compare(password, user.password);
            // If isMatch is false error out as the password is incorrect
            if (!isMatch) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid Credentials'
                    }]
                });
            }
            // Create a value to respond to the front end with
            const payload = {
                user: {
                    id: user.id
                }
            }
            // Creating a token to validate legitimate users without constantly checking the database
            jwt.sign(
                // Passing the value to encrypt
                payload,
                // Getting the encryption secret
                process.env.jwtSecret, 
                // Setting a length of time in milliseconds for the token to last for before requiring relogin
                {
                    expiresIn: 360000
                },
                // Checking for errors then responding to the front end with the token for it to store.
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    });
                }
            );
        } catch (err) {
            // If any errors during the try that isn't accounted for get sent as a 500 Bad request
            res.status(500).send('Server Error');
        }

    });


module.exports = router;