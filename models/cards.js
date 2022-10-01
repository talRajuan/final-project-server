const joi = require("joi");
const mongoose = require("mongoose");
const _ = require('lodash');
const { User } = require("./users");
const Joi = require("joi");

const cardSchema = new mongoose.Schema({
    teacherName:{
        type:String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    teacherDescription:{
        type: String,
            required: true,
            minlength: 2,
            maxlength: 1024
    },
    classAddress: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 500
    },
    teacherPhone:{
            type: String,
            required: true,
            minlength: 9,
            maxlength: 15
    },
    teacherImage: {
        type: String,
            required: true,
            minlength: 11,
            maxlength: 1024
    },
    teacherNumber: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 9_999_999_999
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }



})

const Card = mongoose.model('card', cardSchema);

const cardjoiSchema = joi.object({
teacherName: Joi.string().min(2).max(255).required(),
    teacherDescription: Joi.string().min(2).max(1024).required(),
    classAddress: Joi.string().min(2).max(500).required(),
    teacherPhone: Joi.string()
    .min(9)
    .max(15)
    .required()
    .regex(/^0[2-9][-]?\d{7,9}$|^05[0-9][-]?\d{7,9}$|^07[7,3][-]?\d{7,9}$/),
    teacherImage: Joi.string().min(11).max(1024).uri().allow(""),
});

const generateTeacherNumber = async ()=>{
while(true){
    let randomNumber = _.random(100,9_999_999_999);
    let card = await Card.findOne({teacherNumber: randomNumber});
    if(!card) {
        return String(randomNumber)
    }
} //uuid

}


const validateCard = (card)=>cardjoiSchema.validate(card)


module.exports = {
    Card,
    validateCard,
    generateTeacherNumber
}