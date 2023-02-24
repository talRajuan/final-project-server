const cardsRouter = require('express').Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const {Card, validateCard, generateTeacherNumber} = require('../models/cards')

cardsRouter.post('/',auth, async (req,res)=>{
   console.log(req);
    const {error} = validateCard(req.body);
    if (error){
        return res.status(400).json({message: error.details.map(d=>d.message)})
    }
    let card = new Card({
        teacherNumber: await generateTeacherNumber(),
        teacherImage: req.body.teacherImage ?? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        user_id: req.user._id,
        ...req.body
    })
    

    card = await card.save();
    res.json(card)

   
})


cardsRouter.get('/', auth, async (req, res) => {
     console.log('request',req.user);
    const cards = await Card.find({
        user_id: req.user._id
    })
    res.json(cards)
})



cardsRouter.get('/:id' , auth , async (req,res)=>{
    const card = await Card.findOne({_id: req.params.id , user_id: req.user._id});
    if(!card)return res.status(404).json({messgae: "dont found a card"})
    res.send(card)
})

cardsRouter.put('/:id', auth, async (req,res)=>{
    console.log("body" , req.body);
    const {error} = validateCard(req.body);
     if (error)return res.status(400).json({message: error.details[0].message})

     let card = await Card.findOneAndUpdate({_id: req.params.id, user_id: req.user._id}, req.body)
     if (!card) return res.status(404).json({message: 'card not found'})
     card = await Card.findOne({_id:req.params.id, user_id: req.user._id});
     res.send(card)
    
      
})


cardsRouter.delete('/:id', auth, async (req, res) => {
    const card = await Card.findOneAndRemove({
        _id: req.params.id,
        user_id: req.user._id
    });
    if (!card) return res.status(404).send('The card with the given ID was not found.');
    res.send(card);
});



module.exports = cardsRouter;