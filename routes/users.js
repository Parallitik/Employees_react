import express from 'express';
import UserController from "../controllers/user-controller.js"
import { body } from 'express-validator'

const router = express.Router();
// const { auth } = require('../middlewares/auth')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    UserController.registration
);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/refresh', UserController.refresh);
router.get('/current', UserController.current);
//auth

export default router;
