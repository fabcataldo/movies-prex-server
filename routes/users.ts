import { Router, Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { tokenVerification } from "../middlewares/autentication";

const userRoutes = Router();

userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;

    User.findOne({ email: body.email }, (err: any, userDB: any) => {
        if (err) throw err;

        console.log('userdb')
        console.log(userDB)
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Wrong user/password'
            })
        }

        if (userDB.comparePassword(body.password)) {
            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUser,
                user: {
                    _id: userDB._id,
                    name: userDB.name,
                    email: userDB.email,
                    avatar: userDB.avatar
                }
            })
        } else {
            return res.json({
                ok: false,
                mensaje: 'Wrong user/password'
            })
        }
    });
});

userRoutes.post('/create', (req: Request, res: Response) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };

    User.create(user).then(userDB => {

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        })

    }).catch((err: any) => {
        res.json({
            ok: false,
            err
        });
    });
});

userRoutes.get('/', [tokenVerification], (req: any, res: Response) => {
    const user = req.user;
    res.json({
        ok: true,
        user
    });
});

export default userRoutes;