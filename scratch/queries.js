const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};

//     if (searchTerm) {
//       filter.title = { $regex: searchTerm, $options: 'i' };
//     }

//     return Note.find(filter).sort({ updatedAt: 'desc' });
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


  mongoose.connect(MONGODB_URI,{useNewUrlParser:true})
    .then(() => {
        let filter = {};
        const id = "000000000000000000000004";
        
        return Note.findById(id,item => console.log(item));
    })
    .then(results => {
        console.log(results);
    })
    .then(() => {
        return mongoose.disconnect()
    })
    .catch(err => {
        console.error(`ERROR: ${err.message}`);
        console.error(err);
    });

// mongoose.connect(MONGODB_URI,{useNewUrlParser:true})
//     .then(()=> {
//         const title = "title"
//         const content = "title"
//         return Note.create({title,content})
//     })
//     .then(results => console.log(results))
//     .then(() => {
//                 return mongoose.disconnect()
//             })
//     .catch(err => {
//         console.error(`ERROR: ${err.message}`);
//         console.error(err);
//     });

// mongoose.connect(MONGODB_URI,{useNewUrlParser:true})
//     .then(() => {
//         const id = "000000000000000000000004";
//         return Note.findByIdAndUpdate(id,{title:'michael'})
//     })
//     .then(results => console.log(results))
//     .then(() => {
//         return mongoose.disconnect()
//     })
//     .catch(err => {
//         console.error(`ERROR: ${err.message}`);
//         console.error(err);
//     });

// mongoose.connect(MONGODB_URI,{useNewUrlParser:true})
//     .then( () => {
//         const id = "000000000000000000000004";
//         return Note.findByIdAndRemove(id)
//     })
//     .then(results => console.log(results))
//     .then(()=> {
//         mongoose.disconnect();
//     })
//     .catch(err => {
//         console.error(`ERROR: ${err.message}`);
//         console.error(err);
//     })