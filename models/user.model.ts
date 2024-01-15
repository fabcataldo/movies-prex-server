import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, 'The name is mandatory']
    },
    avatar: {
        type: String,
        default: 'av-1.jpg'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is mandatory']
    },
    password: {
        type: String,
        required: [true, 'The password is mandatory']
    }
});

userSchema.method('comparePassword', function( password: string = ' ' ) : boolean{
    if( bcrypt.compareSync(password, this.password) ) {
        return true;
    } else {
        return false;
    }
})

interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    avatar: string;

    comparePassword(password: string):boolean;
}

export const User = model<IUser>('User', userSchema);
