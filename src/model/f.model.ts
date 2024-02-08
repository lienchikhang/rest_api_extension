import { timeStamp } from "console";
import mongoose, { Schema, } from "mongoose";

const FSchema = new Schema({
    c_user: {
        type: String,
        require: true,
    },
    xs: {
        type: String,
        require: true
    }
}, {timestamps: true});

const Fmodel = mongoose.model('FModel', FSchema);

module.exports = Fmodel;