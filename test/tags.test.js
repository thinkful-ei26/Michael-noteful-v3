const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Tag = require('../models/tags');

const { tags } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Running Tests on Tags Endpoints', function () {

    before(function () {
        return mongoose.connect(TEST_MONGODB_URI)
          .then(() => mongoose.connection.db.dropDatabase());
      });
    
      beforeEach(function () {
        return Tag.insertMany(tags);
      });
    
      afterEach(function () {
        return mongoose.connection.db.dropDatabase();
      });
    
      after(function () {
        return mongoose.disconnect();
      });

      describe('GET all api call',function () {
          let data = {};
          it('Should return all tags', function () {
            
            return Tag.find()
            .then(results => {
                data = results;
                return chai.request(app)
                .get('/api/tags')
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.length(data.length);
                })
            })
              
          })
      })

      describe('GET by Id api call',function () {
        let data = {};
        it('Should return a single tag', function () {
          
          return Tag.findOne()
          .then(result => {
              data = result;
              return chai.request(app)
              .get(`/api/tags/${result.id}`)
              .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
      
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.keys('id', 'name','createdAt','updatedAt');
      
                // 3) then compare database results to API response
                expect(res.body.id).to.equal(data.id);
                expect(res.body.name).to.equal(data.name);
                expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
                expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
              })
          })
            
        })
    })


    describe('POST /api/tags/', function () {
        it('Create new tag and validate fields', function () {
          const newItem = {
            'name': 'the name for testing'
          };
    
          let res;
          // 1) First, call the API
          return chai.request(app)
            .post('/api/tags/')
            .send(newItem)
            .then(function (_res) {
              res = _res;
              expect(res).to.have.status(201);
              expect(res).to.have.header('location');
              expect(res).to.be.json;
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
              // 2) then call the database
              return Tag.findById(res.body.id);
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

      describe('PUT /api/tags/:id', function () {
        it('Should modify an object in the database.', function () {
            const newItem = {
            'name': "bob",
            'id': "000000000000000000000001"
            };
    
            let res;
            // 1) First, call the API
            return chai.request(app)
            .put(`/api/tags/${newItem.id}`)
            .send(newItem)
            .then(function (_res) {
                res = _res;
                
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
                // 2) then call the database
               
                return Tag.findById(res.body.id);
            })
            // 3) then compare the API response to the database results
            .then(data => {
               
                expect(res.body.name).to.equal(data.name);
                expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
                expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
            });
        });
        })
    
    
    
    
        describe('DELETE Delete Test', function () {
    
            it('Should delete the tag', function () {
                const id = '5c0043ced07f5b1a14618af6';
                return chai.request(app)
                .delete(`/api/tags/${id}`)
                .then(res => {
                    expect(res).to.have.status(204);
                    expect(res.title).to.equal(undefined);
                })
                
            })
              
          })
        

      //end test
})