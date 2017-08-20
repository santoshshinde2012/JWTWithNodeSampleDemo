'use strict';

var supertest = require('supertest');
var should = require('should');
var fs = require("fs");

var requestjs = require("request");
var request = requestjs.defaults({jar: true});

var credentials = {
    email: 'demo+test@test.com',
    password: 'DemoTest123'
};

var apiMain = supertest.agent("http://vidlogsdev.com");
var apiSite = supertest.agent("http://manelpb.vidlogsdev.com");

describe('Users API', function () {

    var user1 = {
        name: "Emmanuel Tester 112233",
        email: "emmmm+tester1@test.com",
        password: "123456"
    }

    var user3 = {
        name: "Emmanuel Tester 112233",
        email: "emmmm+tester2@test.com",
        password: "123456"
    }

    /**
     * creates some test users
     */
    before(function(done) {
        // tries to delete user 1 and create
        apiMain
            .delete("/api/user")
            .send({
                email: user3.email
            })
            .end(function(err, res) {

                // creates necessary users for testing
                apiMain
                    .post("/signup")
                    .send(user3)
                    .expect(200)
                    .end(function(err, res) {
                        res.body.should.have.property("token"); // it means that it could logi
                        done(err);
                    });

                done();
            });
    });

    /**
     * logins with one of the users
     */
    before(function (done) {
        apiMain
            .post('/login')
            .send(credentials)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                should.exist(res.headers['set-cookie']);
                res.body.should.have.property('token');

                apiSite
                    .get("/siteauth?token=" + res.body.token)
                    .expect(302)
                    .end(function (err, res) {

                        should.exist(res.headers['set-cookie']);

                        done();

                    });
            });
    });

    describe("Teammates", function() {
        var inviteTo = {
            name: "Emmanuel",
            email: "tester@test.com"
        }

        var inviteTo2 = {
            name: "Emmanuel",
            email: "emmanuel@sixfactors.ca"
        }

        var invitation;
        var userInvited;

        it("Should send an invitation link based on email address", function(done) {
            apiSite
                .post("/api/teammates/invitation")
                .send({ email: user3.email })
                .expect(200)
                .end(function(err, res) {
                    res.body.should.have.property("message");
                    res.body.should.have.property("invitation");

                    user3._id = res.body.user._id;
                    invitation = res.body.invitation;

                    done(err);
                })
        });


        it("Should allows registered users login from an invitation link where the email is the same as the invitation email", function(done) {

            console.log(invitation);

            apiSite
                .post("/login/?invitation=" + invitation.id)
                .send({
                    name: user3.name,
                    email: user3.email,
                    password: user3.password
                })
                .expect(200)
                .end(function(err, res) {
                    res.body.should.have.property("token"); // it means that it could login
                    done(err);
                });
        });

        it("Should not send an invitation link based on email address that already has the store active", function(done) {
            apiSite
                .post("/api/teammates/invitation")
                .send({ email: user3.email })
                .expect(400)
                .end(function(err, res) {
                    done(err);
                })
        });

        it("Should not allow an expired invitation being used", function(done) {
            apiSite
                .post("/invite/1122334455")
                .send({
                    name: user3.name,
                    email: user3.email,
                    password: "changeme"
                })
                .expect(400)
                .end(function(err, res) {
                    res.should.have.property("error");
                    done(err);
                });

        });

        it("Should list all teammembers from store", function(done) {
            apiSite
                .get("/api/teammates")
                .expect(200)
                .end(function(err, res) {
                    //console.log(res.body);
                    res.body.should.have.property("users");

                    done(err);
                });
        });

        it("Should remove the user from store", function(done) {
            apiSite
                .delete("/api/teammates/" + user3._id)
                .expect(200)
                .end(function(err, res) {
                    res.body.message.should.equal("User removed successfully");

                    done(err);
                });
        });
    });

    after(function(done) {
       // remove the test user
        apiMain
            .delete("/api/user")
            .send({
                email: user3.email
            })
            .end(function(err, res) {
                done(err);
            });

    });

});