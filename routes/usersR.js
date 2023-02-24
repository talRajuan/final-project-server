const usersRouter = require("express").Router();
const {
    User,
    validateUser
} = require("../models/users");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require("../middleware/auth");
const { Card } = require("../models/cards");



usersRouter.get('/me', auth, async (req, res) => {
    //res.json(req.user)
    const user = await User.findById(req.user._id).select('-password')
    console.log(user);
    res.send(user);
})



usersRouter.post('/', async (req, res) => {

    const err = validateUser(req.body).errors;
    if (err) {
        return res.status(400).json({
            errors: err.details.map(d => d.message)
        })
    }


    let user = await User.findOne({
        email: req.body.email
    });
    if (user) {
        return res.status(400).json({
            message: `${user.email} already exists`
        })
    };
    user = new User(req.body)



    const salt = await bcrypt.genSalt(12)
    user.password = await bcrypt.hash(req.body.password, salt)
    //beffore saving hash paaword
    await user.save()
    res.status(201).json(_.pick(user, ['name', 'email', 'biz', '_id']))
    // new User({
    //     name:req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     biz: req.body.biz
    // })
    // .save()
    // .then(doc => res.json(doc))
    // .catch(e=>{
    //     if(e.keyValue){
    //         return res.status(400).json({message: `${e.keyValue.email} already exist`})
    //     }
    //     res.status(500).json(e)
    // })
})
usersRouter.get("/add-favorite/:id", auth, async (req, res, next)=>{
    //Prove existance of card id
    console.log("log2", req.params.id);
    const card = await Card.findById(req.params.id)
    if(!card){
        return res.status(400).send("no card provided");
    }

    //Prevent duplicated card
    const duplicated = await User.findOne({_id: req.user._id, favorites: card})
    if(duplicated){
        return res.status(400).send('card alrady exist');
    }

    try {
        // update user favorites with card id by agrigation with $push command.
        const updateUser = await User.findByIdAndUpdate(
        req.user._id,
        {$push: {favorites: req.params.id}},
        {new : true}
        )
        res.status(201).send(updateUser);
    } catch (error) {
        res.status(401).send(error, "could not add card to favorites")
    }
    //update user documnet (add to favorites array)id
})

usersRouter.get("/user-favorites", auth, async (req,res, next)=>{
    const user = await User.findById(req.user._id);
    //agrigation:
    try{
        const favorites = await Card.find({
            _id : {$in:user.favorites}
        })
        res.status(200).send(favorites);
    }catch (error) {
        res.status(400).send(error)
    }
})

usersRouter.get("/remove-favorite/:id", auth ,async (req, res, next)=>{
    try{
        const card = await Card.findById(req.params.id)
        if(!card){
            return res.status(400).send("no card");
        }
         const updateUser = await User.findByIdAndUpdate(
             req.user._id, {
                 $pull: {
                     favorites: card._id
                 }
             }, {
                 new: true
             }
         )
        res.status(200).send(updateUser)
    }catch(error){
        
        res.status(400).send(error)
    }
})

module.exports = usersRouter;