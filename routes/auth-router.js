import express from 'express'
import controllers from './controllers/index.js'

const authRouter = express.Router()

authRouter.post('/login', controllers.auth.login)
authRouter.post('/logout', controllers.auth.logout)
//authRouter.post('/register', controllers.auth.register)
authRouter.post('/register', (req, res, next) => {
    console.log("Before calling controller:", req.body); 
    controllers.auth.register(req, res, next);
});
export default authRouter;
