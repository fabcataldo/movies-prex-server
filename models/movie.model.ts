import { Schema, Document, model} from 'mongoose';

const movieSchema = new Schema({
    releaseDate: {
        type: Date
    },
    rate: {
        type: Number
    },
    cover:{
        type: String
    },
    title:{
        type: String
    },
    description:{
        type: String
    }
});

movieSchema.pre<IMovie>('save', function(next){
    this.releaseDate = new Date();
    next(); 
});

interface IMovie extends Document{
    releaseDate: Date;
    rate: string;
    cover: string;
    title: string;
    description: string;
}

export const Movie = model<IMovie>('Movie', movieSchema);