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

describe("PUT /api/users/addDrink", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should add a beer to beer and userbeer databases", function(done) {
    db.Data.bulkCreate([{ name: "Tecate" }]).then(function() {
      db.User.bulkCreate([
        { username: "John", email: "john@gmail.com", password: "Password1!" }
      ]).then(function() {
        db.User.findOne({
          where: { username: "John" },
          include: [{ model: db.Beer }]
        }).then(function(dbUser) {
          db.Data.findOne({
            where: { id: 1 }
          }).then(function(beerData) {
            var Data = { name: beerData.name };
            request
              .put("/api/users/addDrink")
              .send(Data)
              .end(function(err, res) {
                console.log(res);
              });
            console.log("After the put");
            dbUser.createBeer(Data);
            done();
          });
          // The `done` function is used to end any asynchronous tests
        });
      });
    });
  });
});
