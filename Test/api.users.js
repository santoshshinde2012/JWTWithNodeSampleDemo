'use strict';

var supertest = require('supertest');
var should = require('should');

var apiMain = supertest.agent("http://localhost:3000");

var token = null, userId = null;

describe('Users API', function () {

    var user = null;
    /**
     * creates some test users
     */
    before(function(done) {
      user = {
          name: "Santosh Shinde",
          email: "santosh.shinde@test.com",
          password: "santosh@test123"
      }
      done();
    });


    describe("User", function() {

        it("Should user get create", function(done) {
          /** creates necessary users for testing
          ** http://localhost:3000/api/auth/signup
          ** @params user = {}
          **/
          apiMain
              .post("/api/user")
              .send(user)
              .expect(200)
              .end(function(err, res) {
                  res.body.should.have.property("created"); // it means user get created
                  res.body.should.have.property("_id"); // it means user get and return _id
                  userId = res.body._id;
                  done(err);
              });
        });

        it("Should user get token[login] based on email address and password", function(done) {
            apiMain
                .post("/api/auth/login")
                .send({ email: user.email, password: user.password })
                .expect(200)
                .end(function(err, res) {
                    res.body.should.have.property("token");
                    token = res.body.token;
                    done(err);
                })
        });

        it("Should user get user details based on token", function(done) {
            apiMain
                .get("/api/user")
                .set('token',token)
                .expect(200)
                .end(function(err, res) {
                    res.body.should.have.property("created"); // it means user get created
                    res.body.should.have.property("_id"); // it means user get and return _id
                    userId = res.body._id;
                    done(err);
                })
        });

        it("Should user get help based on token", function(done) {
            apiMain
                .get("/api/help")
                .set('token',token)
                .expect(200)
                .end(function(err, res) {
                    res.body.should.have.property("message");
                    done(err);
                })
        });

        it("Should user get delete based on userId", function(done) {
            // remove the test user
             apiMain
                 .delete("/api/user")
                 .send({
                     'userId': userId
                 })
                 .end(function(err, res) {
                     res.body.should.have.property("message");
                     done(err);
                 });
        });

    });

    after(function(done) {
      done();
    });

});
