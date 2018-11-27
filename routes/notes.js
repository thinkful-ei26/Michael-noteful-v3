'use strict';

const express = require('express');

const router = express.Router();
const Note = require('../models/note');
/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm} = req.query;
  console.log(searchTerm);
  let filter = {};
  if (searchTerm) {
    filter.title = { $regex: searchTerm, $options: 'i' };
  }
   return Note.find(filter).sort({ updatedAt: 'desc' })
    .then(results => {
    console.log(results);
    res.json(results);
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log("here");
  return Note.findById(id)
  .then(results => {
    console.log(results);
    res.json(results);
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title,content} = req.body;
  return Note.create({title,content})
  .then(results => {
    console.log(results);
    res.status(201).json(results);
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;


  return Note.findByIdAndUpdate(id,{title:'michael'})
  .then( results => {
    console.log(results);
    res.json(results);
  })

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  return Note.findByIdAndRemove(id)
  .then(() => {
    res.status(204).end();
  })
});

module.exports = router;