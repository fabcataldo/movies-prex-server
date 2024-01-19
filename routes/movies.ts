import { Router, Request, Response } from "express";
import { tokenVerification } from "../middlewares/autentication";
import { Movie } from "../models/movie.model";

const moviesRoutes = Router();

moviesRoutes.get('/', [tokenVerification], async (req: any, res: Response) => {
    await Movie.find()
        .exec((err, resBD) => {
        if(err){
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.status(200).json({
                ok: true,
                movies: resBD
            })
        }
    })
});

moviesRoutes.patch('/:id', [tokenVerification], async (req: any, res: Response) => {
    const body = req.body;
    const id = req.params.id;

    await Movie.findByIdAndUpdate(id, body, {new: true}).exec((err, resBD) => {
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

moviesRoutes.post('/create', [tokenVerification], (req: Request, res: Response) => {
    Movie.create(req.body).then(userDB => {
        res.json({
            ok: true,
            movie: userDB
        })
    }).catch((err: any) => {
        res.json({
            ok: false,
            err
        });
    });
});

export default moviesRoutes;