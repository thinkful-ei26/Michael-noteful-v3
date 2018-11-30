'use strict';

const express = require('express');

const router = express.Router();
const Tag = require('../models/tags');

router.get('/', function (req,res,next) {
    

    return Tag.find({}).sort({'name': 'desc'})
    .then(results => {
        console.log(results);
        res.status(200).json(results);
    })



})


module.exports = router;