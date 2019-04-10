var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/beers", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should find all examples", function(done) {
    // Add some examples to the db to test with
    db.Data.bulkCreate([
      { name: "Tecate", descript: "First Description", abv: 4 },
      { name: "Corona", descript: "Second Description", abv: 5 }
    ]).then(function() {
      // Request the route that returns all examples
      request.get("/api/users").end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body.dataValues;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody).to.be.an("object");

        expect(responseBody.name)
          .to.be.an("object")
          .that.includes({
            name: "Tecate",
            descript: "First Description",
            abv: 4
          });

        expect(responseBody[1])
          .to.be.an("object")
          .that.includes({
            text: "Second Example",
            description: "Second Description"
          });

        // The `done` function is used to end any asynchronous tests
        done();
      });
    });
  });
});
