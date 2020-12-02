const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Destructuring out the functions from express-validator
const {
    check,
    validationResult
} = require('express-validator');

// Reference to the User schema
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user to database
// @access  Public
router.post('/', 
    // Passing an array to express-validator to check the req.body for validations
    // https://express-validator.github.io/docs/
    [
        // Checking req.body for a name property and setting a message to respond with if there isnt one
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Please include a valid email')
            .isEmail(),
        check('password', 'Please enter a password with 6 or more characters')
            .isLength({
                min: 6
            })
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
            name,
            email,
            password
        } = req.body;
        // Setting the try block for the await sections
        try {
            // Checking the database for an existing matching email
            let user = await User.findOne({
                email
            })
            // If there is a match for the email respond with an error
            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'User already exists'
                    }]
                });
            }
            // If no existing user create one from the schema
            user = new User({
                name,
                email,
                password
            });
            // Generate the salt for the password encryption
            // https://www.npmjs.com/package/express-validator
            const salt = await bcrypt.genSalt(13);
            // Change the created users password to an encryped value
            user.password = await bcrypt.hash(password, salt);
            // Save the user with the updated encryped password
            await user.save();
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