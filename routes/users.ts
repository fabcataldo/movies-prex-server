import { Router, Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { tokenVerification } from "../middlewares/autentication";

const userRoutes = Router();

userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;

    User.findOne({ username: body.username }, (err: any, userDB: any) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Wrong user/password'
            })
        }

        if (userDB.comparePassword(body.password)) {
            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                username: userDB.username,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUser,
                user: {
                    _id: userDB._id,
                    username: userDB.username,
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
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };

    User.create(user).then(userDB => {
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            username: userDB.username,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser,
            user
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

userRoutes.patch('/:id/avatar', [tokenVerification], async (req: any, res: Response) => {
    const body = req.body;
    const id = req.params.id;

    await User.findByIdAndUpdate(id, body).exec((err, resBD) => {
        if(err){
            res.status(400).send(err);
        } else {
            res.status(200).json({
                ok: true,
                movie: resBD
            })
        }
    })
})

export default userRoutes;