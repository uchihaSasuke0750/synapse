const router = require('express').Router();

const {check , validationResult} = require('express-validator')

let userController = require('../controllers/userController.js');

const authCheck = require('../middleware/check_auth');


/**
 * User routes
 */


// @route       GET api/v1/users/create
// @desc        Create User
// @access      Public  
router.post('/create' ,
[
    check('name').isLength({ min: 4 }).withMessage('Please enter a valid name'),
    check('email').isEmail().withMessage('Please enter a valid Email'),
    check('password' , 'Please enter a valid Password with 6 or more characters')
    .isLength({min : 6})
],
userController.createUser);

router.post('/login' ,
[
    check('email').isEmail().withMessage('Please enter a valid Email'),
    check('password' , 'Please enter a valid Password with 6 or more characters')
    .isLength({min : 6})
],
userController.login);

router.get('/', authCheck,  userController.me);









module.exports = router;