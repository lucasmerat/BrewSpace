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
      if (dbUser === null) {
        db.User.create({
          email: req.body.email,
          username: req.body.username,
          password: Encrypt(req.body.password)
        }).then(function(dbCreated) {
          res.json(dbCreated);
        });
      } else {
        res.json(false);
      }
    });
  });

  // Log In
  app.post("/api/signin", function(req, res) {
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
        res.json({
          error: "Incorrect email or password"
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

  //Add beer to user and database at the same time
  app.put("/api/users/addDrink", function(req, res) {
    db.User.findOne({
      where: { username: req.body.username },
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      //Req.body must be name:beer...as is going to be added to the beer DB
      db.Data.findOne({
        where: { id: req.body.dataId }
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
      res.json(dbUser);
    });
  });

  //Check user top beers
  app.get("/api/users/top/:username", function(req, res) {
    db.User.findOne({
      where: { username: req.params.username },
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      if (dbUser.Beers.length === 0) {
        res.json([]);
      } else {
        res.json(BeerReduction(dbUser.Beers));
      }
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

  //Search a beer from beer database
  app.get("/api/data/:beer", function(req, res) {
    var searchTerm = req.params.beer;
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

  app.get("/api/data/display/:beer", function(req, res) {
    console.log(req.params);
    db.Data.findOne({
      where: {
        name: req.params.beer
      }
    }).then(function(result) {
      res.json(result);
    });
  });

  //Add beer to database

  app.post("/api/data", function(req, res) {
    let beerName = req.body.name;
    let beerDescription = req.body.description;
    let beerAbv = req.body.abv;
    db.Data.create({
      name: beerName,
      descript: beerDescription,
      abv: beerAbv
    }).then(function(result) {
      res.json(result);
    });
  });

  //Add or update profile image

  app.put("/api/users/addImage", function(req, res) {
    console.log(req.body.imageUrl);
    db.User.update(
      {
        image: req.body.imageUrl
      },
      {
        where: {
          username: req.body.userName
        }
      }
    ).then(function(result) {
      res.json(result);
    });
  });

  //Get user profile image
  app.get("/api/users/getImage/:username", function(req, res) {
    db.User.findOne({
      where: {
        username: req.params.username
      }
    }).then(function(image) {
      res.json(image);
    });
  });
  //Top Drinkers
  app.get("/api/topusers", function(req, res) {
    db.User.findAll({
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      if (dbUser !== null) {
        var Users = [];
        var Beers = [];
        var TopUsers = {};
        var TopComplete = [];
        for (var i = 0; i < dbUser.length; i++) {
          Users.push(dbUser[i].username);
          if (dbUser[i].Beers.length !== 0) {
            Beers.push(BeerReduction(dbUser[i].Beers).length);
          } else {
            Beers.push(0);
          }
        }
        for (i = 0; i < Beers.length; i++) {
          TopUsers.Name = Users[i];
          TopUsers.Quantity = Beers[i];
          TopComplete.push(TopUsers);
          TopUsers = {};
        }
        if (TopComplete.length > 1) {
          TopComplete.sort(function(a, b) {
            return b.Quantity - a.Quantity;
          });
        }
      }
      res.json(TopComplete);
    });
  });
};
