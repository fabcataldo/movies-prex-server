import Server from "./classes/server";
import userRoutes from "./routes/users";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import moviesRoutes from "./routes/movies";

const server = new Server();

server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());
server.app.use(cors({origin: true, credentials: true}));

server.app.use('/user', userRoutes);
server.app.use('/movie', moviesRoutes);

mongoose.connect('mongodb://localhost:27017/prex-movies', {
    useNewUrlParser: true, useCreateIndex: true
}, (err) => {
    if(err) throw err;

    console.log('DB ONLINE');
});

server.start( () => {
    console.log(`Server running on port ${server.port}`);
});