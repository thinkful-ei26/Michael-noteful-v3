'use strict';
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const Note = require('../models/note');
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
  
  return Note.findByIdAndUpdate(id,{$inc:{openedCount:1}})
  .then(results => {
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
  const {title,content,folderId} = req.body;
  if(mongoose.Types.ObjectId.isValid(folderId)){

  
  return Note.create({title,content,folderId})
  .then(results => {
    
    res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
  })
  .catch(err => {
    res.sendStatus(500);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })
}else{
  res.sendStatus(500);
}
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  
  const bodyInfo = {
    title: req.body.title,
    content: req.body.content,
    folderId: req.body.folderId
  }
  if(mongoose.Types.ObjectId.isValid(req.body.folderId)){
  return Note.findByIdAndUpdate(id,bodyInfo, {new: true,upsert: true})
  .then( results => {
    
    res.status(200).json(results);
  })
  .catch(err => {
    res.sendStatus(500);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })
  }else{
    res.sendStatus(500);
  }
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