const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Folder = require('../models/folder');

const { folders } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Running Tests on Folder Endpoints', function () {
    
    before(function () {
        return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
          .then(() => mongoose.connection.db.dropDatabase());
      });
    
      beforeEach(function () {
        return Folder.insertMany(folders);
      });
    
      afterEach(function () {
        return mongoose.connection.db.dropDatabase();
      });
    
      after(function () {
        return mongoose.disconnect();
      });

      describe('GET /api/folders', function () {
        // 1) Call the database **and** the API
        // 2) Wait for both promises to resolve using `Promise.all`
        it('Should return all the folders', function (){
        return Promise.all([
            Folder.find(),
            chai.request(app).get('/api/folders')
          ])
          // 3) then compare database results to API response
            .then(([data, res]) => {
              expect(res).to.have.status(200);
              expect(res).to.be.json;
              expect(res.body).to.be.a('array');
              expect(res.body).to.have.length(data.length);
            });
      })
    });

    describe('GET /api/folders/:id', function () {
       
    it('should return correct folder', function () {
        let data;
        // 1) First, call the database
        return Folder.findOne()
        .then(_data => {
            data = _data;
            // 2) then call the API with the ID
            return chai.request(app).get(`/api/folders/${data.id}`);
        })
        .then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;

            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('id', 'name', 'createdAt','updatedAt');

            // 3) then compare database results to API response
            expect(res.body.id).to.equal(data.id);
            expect(res.body.name).to.equal(data.name);
            expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
            expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
    })


    describe('POST /api/folders', function () {
    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'name': 'the name for testing'
      };

      let res;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/folders/')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Folder.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  })

  describe('PUT /api/folders/:id', function () {
    it('Should modify an object in the database.', function () {
        const newItem = {
        'title': 'Hello heloohelhlelhlehoeh!',
        'content': 'MAJOR CONTENT UPDATES'
        };

        let res;
        // 1) First, call the API
        return chai.request(app)
        .put('/api/folders/000000000000000000000001')
        .send(newItem)
        .then(function (_res) {
            res = _res;
            
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
            // 2) then call the database
           
            return Folder.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
           
            expect(res.body.name).to.equal(data.name);
            expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
            expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
    })




    describe('Should delete the item at the given id', function () {

        it('should be deleted', function () {
            const id = '5c0043ced07f5b1a14618af6';
            return chai.request(app)
            .delete(`/api/folders/${id}`)
            .then(res => {
                expect(res).to.have.status(204);
                expect(res.title).to.equal(undefined);
            })
            
        })
          
      })
    

    //end

})