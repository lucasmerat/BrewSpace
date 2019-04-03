var db = require("../models");
var Encryption = require("../functions/bcrypt.js");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  // Create User
  // eslint-disable-next-line no-unused-vars
  app.post("/api/signin", function(req, res) {
    console.log(Encryption);
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(dbUser) {
      if (dbUser === null) {
        db.User.create({
          email: req.body.email,
          password: Encrypt(req.body.password)
        }).then(function(dbCreated) {
          res.json(dbCreated);
        });
      }
    });
  });

  // Log In
  // eslint-disable-next-line no-unused-vars
  app.post("/api/login", function(req, res) {
    console.log(req.body);
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(dbUser) {
      if (Decrypt(req.body.password, dbUser.password)) {
        console.log(true);
      } else {
        console.log(false);
      }
    });
  });
};
