const allCardsRouter = require('express').Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const {
    Card,
} = require('../models/cards')


allCardsRouter.get('/', auth, async (req, res) => {
    console.log('request', req.user);
    const cards = await Card.find()
    res.json(cards)
})


module.exports = allCardsRouter;