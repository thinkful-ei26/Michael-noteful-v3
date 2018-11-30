'use strict';
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const Note = require('../models/note');
const Tag = require('../models/tags');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm, folderId} = req.query;
  const re = searchTerm && RegExp(searchTerm, 'i');
  const filter = {
    $and: [
      re ? {$or: [{'title': re}, {'content': re}]}: {},
      folderId ? {folderId}: {},
    ]
  };
   return Note.find(filter).sort({ updatedAt: 'desc' })
    .populate('tags')
    .then(results => {
    res.json(results);
  })
  .catch(err => {
    res.sendStatus(500);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log('hitting the route')
  return Note.findById(id)
  .populate('tags')
  .then(results => {
    console.log(results);

    if(!results){
      res.sendStatus(404);
    }else{
      res.json(results);
  }})
  .catch(err => {
    res.sendStatus(404);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title,content,folderId, tags} = req.body;
  if(!mongoose.Types.ObjectId.isValid(folderId)){
    res.sendStatus(500);
  }
  
  return Note.create({title,content,folderId, tags})
  .then(results => {
    res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
  })
  .catch(err => {
    res.sendStatus(500);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  
  const bodyInfo = {
    title: req.body.title,
    content: req.body.content,
    folderId: req.body.folderId
  }
  //Check the ID
  if(!mongoose.Types.ObjectId.isValid(id)){
    res.sendStatus(500);
  }
  //Check the folder
  if(!mongoose.Types.ObjectId.isValid(req.body.folderId)){
    res.sendStatus(500);
  }

  //Check the tags array
  if(tags){
    tags.map(tempTagId => {
      if(!mongoose.Types.ObjectId.isValid(tempTagId)){
        res.sendStatus(500);
      }
    })
    res.sendStatus(500);
  }

  return Note.findByIdAndUpdate(id,bodyInfo, {new: true,upsert: true})
  .then( results => {
    
    res.status(200).json(results);
  })
  .catch(err => {
    res.sendStatus(500);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  return Note.findByIdAndRemove(id)
  .then(() => {
    res.status(204).end();
  })
  .catch(err => {
    res.sendStatus(500);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })
});

module.exports = router;