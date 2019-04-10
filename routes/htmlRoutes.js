// var db = require("../models");
var Cookies = require("cookies");
var db = require("../models");
var moment = require("moment");

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
  // Load landing page
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/signin", function(req, res) {
    var cookies = new Cookies(req, res);
    var log = cookies.get("log");
    if (log) {
      res.redirect("/dashboard");
    } else {
      res.render("signin");
    }
  });

  app.get("/signup", function(req, res) {
    res.render("signup");
  });

  app.get("/dashboard", function(req, res) {
    var cookies = new Cookies(req, res);
    var log = cookies.get("log");
    console.log(log);
    if (log) {
      res.render("dashboard");
    } else {
      res.redirect("/");
    }
  });

  app.get("/profile", function(req, res) {
    var cookies = new Cookies(req, res);
    var log = cookies.get("log");
    console.log(log);
    if (log) {
      res.render("profile");
    } else {
      res.redirect("/");
    }
  });

  //Create user profile page
  app.get("/profile/:username", function(req, res) {
    db.User.findOne({
      where: {
        username: req.params.username
      },
      include: [{ model: db.Beer }]
    }).then(function(dbUser) {
      if (dbUser !== null) {
        var TimeBeers = [];
        var NameBeers = [];
        var TimelineBeers = [];
        var Timeline = [];
        var BeersInfo = dbUser.Beers.reverse();
        var BeerLength = 50;
        var TopBeers = [];
        if (BeersInfo.length < BeerLength) {
          BeerLength = BeersInfo.length;
        }
        for (var i = 0; i < BeerLength; i++) {
          TimeBeers.push(
            moment(
              BeersInfo[i].createdAt,
              "YYYY-MM-DD[T]HH:mm:ss.sssZ"
            ).calendar()
          );
          NameBeers.push(dbUser.Beers[i].name);
        }
        for (i = 0; i < NameBeers.length; i++) {
          TimelineBeers.Name = NameBeers[i];
          TimelineBeers.Time = TimeBeers[i];
          Timeline.push(TimelineBeers);
          TimelineBeers = {};
        }
        //Check Top Beers
        if (dbUser.Beers.length > 0) {
          var TopBeers = BeerReduction(dbUser.Beers);
          if (TopBeers.length > 3) {
            TopBeers = TopBeers.slice(0, 3);
          }
        }
        var UserInformation = {
          User: dbUser,
          Beers: Timeline,
          QuantityBeers: dbUser.Beers.length,
          UniqueBeers: BeerReduction(dbUser.Beers),
          TopBeers: TopBeers
        };
        console.log(UserInformation.QuantityBeers);
        res.render("profile", UserInformation);
      } else {
        res.render("404");
      }
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
