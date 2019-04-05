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

  var BeerReduction = function(array) {
    var Beers = [];
    var BeerNames = [];
    var BeerQuantity = [];
    var BeerResults = {};
    var BeersComplete = [];
    if (array.length === 0) {
      return;
    }
    for (i = 0; i < array.length; i++) {
      Beers.push(array[i].name);
    }

    for (i = 0; i < Beers.length; i++) {
      if (BeerNames.indexOf(Beers[i]) < 0) {
        BeerNames.push(Beers[i]);
        BeerQuantity.push(1);
      } else {
        var index = BeerNames.indexOf(Beers[i]);
        var value = BeerQuantity[index];
        BeerQuantity[index] = value + 1;
      }
    }
    for (i = 0; i < BeerNames.length; i++) {
      BeerResults.Name = BeerNames[i];
      BeerResults.Quantity = BeerQuantity[i];
      console.log(BeerResults);
      BeersComplete.push(BeerResults);
      BeerResults = {};
    }
    return BeersComplete;
  };

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
  app.post("/api/login", function(req, res) {
    console.log(req.body);
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(dbUser) {
      if (Decrypt(req.body.password, dbUser.password)) {
        res.json({
          status: true,
          email: dbUser.email
        });
      } else {
        res.json({
          status: false,
          email: dbUser.email
        });
      }
    });
  });

  //Add beer to database
  app.post("/api/beers", function(req, res) {
    console.log(req.body);
    db.Beer.findOne({
      where: { name: req.body.name }
    }).then(function(dbBeer) {
      if (dbBeer === null) {
        db.Beer.create({ name: req.body.name }).then(function(dbBeer) {
          res.json(dbBeer);
        });
      } else {
        dbBeer.update({ likes: dbBeer.likes + 1 }).then(function(dbBeer) {
          res.json(dbBeer);
        });
      }
    });
  });

  //Check users
  app.get("/api/users", function(req, res) {
    db.User.findAll({
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  //Add beer to user and database at the same time!!!
  app.put("/api/users/:id", function(req, res) {
    db.User.findOne({
      where: { id: req.params.id },
      include: [{ model: db.Beer }]
    })
      .then(function(dbUser) {
        //Req.body must be name:beer...as is going to be added to the beer DB
        dbUser.createBeer(req.body);
      })
      .then(res.send.bind(res));
  });

  //Check user total beers
  app.get("/api/users/total/:id", function(req, res) {
    db.User.findOne({
      where: { id: req.params.id },
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      res.json(dbUser.Beers.length);
    });
  });

  //Check user top beers
  app.get("/api/users/top/:id", function(req, res) {
    db.User.findOne({
      where: { id: req.params.id },
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      res.json(BeerReduction(dbUser.Beers));
    });
  });

  //Check user top beers
  app.get("/api/users/timeline/:id", function(req, res) {
    db.User.findOne({
      where: { id: req.params.id },
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      res.json(dbUser.Beers);
    });
  });

  //Check top beers overall
  app.get("/api/beers/top", function(req, res) {
    db.Beer.findAll({
      include: [{ model: db.User }]
    }).then(function(dbBeer) {
      res.json(BeerReduction(dbBeer));
    });
  });

  //Check beers
  app.get("/api/beers", function(req, res) {
    db.Beer.findAll({
      include: [{ model: db.User }]
    }).then(function(dbBeer) {
      res.json(dbBeer);
    });
  });
};
