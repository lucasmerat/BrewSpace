var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/users", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should add two users to the users model", function(done) {
    db.User.bulkCreate([
      { username: "John", email: "john@gmail.com", password: "Password1!" },
      { username: "Emma", email: "emma@gmail.com", password: "Password1!" }
    ]).then(function() {
      request.get("/api/users").end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody[0])
          .to.be.an("object")
          .that.includes({
            username: "John",
            email: "john@gmail.com",
            password: "Password1!"
          });

        expect(responseBody[1])
          .to.be.an("object")
          .that.includes({
            username: "Emma",
            email: "emma@gmail.com",
            password: "Password1!"
          });

        // The `done` function is used to end any asynchronous tests
        done();
      });
    });
  });
});

describe("GET /api/users/getImage/:username", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should find a user's profile image", function(done) {
    db.User.bulkCreate([
      {
        username: "John",
        email: "john@gmail.com",
        password: "Password1!",
        image: "www.google.com.gif"
      }
    ]).then(function() {
      request.get("/api/users/getImage/John").end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an("object")
          .that.includes({
            image: "www.google.com.gif"
          });

        // The `done` function is used to end any asynchronous tests
        done();
      });
    });
  });
});

describe("POST /api/data", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should find a user's profile image", function(done) {
    request
      .post("/api/data")
      .send({ name: "Tecate", descript: "Yes", abv: 4 })
      .end(function(err, res) {
        console.log(res.body);
        var responseStatus = res.status;
        var responseBody = res.body;

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an("object")
          .that.includes({
            name: "Tecate",
            id: 1,
            abv: 4
          });

        // The `done` function is used to end any asynchronous tests
        done();
      });
  });
});
