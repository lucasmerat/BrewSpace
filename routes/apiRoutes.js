var db = require("../models");
var Encryption = require("../functions/bcrypt.js");

module.exports = function(app) {
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
    BeersComplete.sort(function(a, b) {
      return b.Quantity - a.Quantity;
    });

    return BeersComplete;
  };

  // Create User
  // eslint-disable-next-line no-unused-vars
  app.post("/api/signup", function(req, res) {
    console.log(Encryption);
    db.User.findOne({
      where: {
        $or: [{ email: req.body.email }, { username: req.body.username }]
      }
    }).then(function(dbUser) {
      console.log(dbUser);
      if (dbUser === null) {
        db.User.create({
          email: req.body.email,
          username: req.body.username,
          password: Encrypt(req.body.password)
        }).then(function(dbCreated) {
          res.json(dbCreated);
        });
      }
    });
  });

  // Log In
  app.post("/api/signin", function(req, res) {
    console.log(req.body);
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(dbUser) {
      if (dbUser) {
        if (Decrypt(req.body.password, dbUser.password)) {
          res.json({
            status: true,
            username: dbUser.username
          });
        } else {
          res.json({
            status: false,
            username: dbUser.username
          });
        }
      } else {
        console.log("Incorrect username or password");
        res.json({
          error: "Incorrect email or password"
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
  app.put("/api/users/:id/:dataid", function(req, res) {
    db.User.findOne({
      where: { id: req.params.id },
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      //Req.body must be name:beer...as is going to be added to the beer DB
      db.Data.findOne({
        where: { id: req.params.dataid }
      })
        .then(function(beerData) {
          var Data = { name: beerData.name };
          dbUser.createBeer(Data);
        })
        .then(res.send.bind(res));
    });
  });

  //Check one user
  app.get("/api/users/:id", function(req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  //Check user total beers
  app.get("/api/users/total/:username", function(req, res) {
    db.User.findOne({
      where: { username: req.params.username },
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      res.json(dbUser.Beers.length);
    });
  });

  //Check user top beers
  app.get("/api/users/top/:username", function(req, res) {
    db.User.findOne({
      where: { username: req.params.username },
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      res.json(BeerReduction(dbUser.Beers));
    });
  });

  //Check user last beers
  app.get("/api/users/timeline/:username", function(req, res) {
    db.User.findOne({
      where: { username: req.params.username },
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      res.json(dbUser.Beers.reverse());
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
      res.json(dbBeer.reverse());
    });
  });

  //Check beers
  app.get("/api/data", function(req, res) {
    var searchTerm = req.body.name.trim();
    db.Data.findAll({
      where: {
        name: {
          $like: "%" + searchTerm + "%"
        }
      }
    }).then(function(dbData) {
      if (dbData.length === 0) {
        searchTerm = searchTerm.substring(0, searchTerm.length - 1);
        db.Data.findAll({
          where: {
            name: {
              $like: "%" + searchTerm + "%"
            }
          }
        }).then(function(dbDataMin) {
          res.json(dbDataMin);
        });
      } else {
        res.json(dbData);
      }
    });
  });
};
