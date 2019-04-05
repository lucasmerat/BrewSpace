var db = require("../models");
var Cookies = require("cookies");

module.exports = function(app) {
  // Load landing page
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/signin", function(req, res) {
    var cookies = new Cookies(req, res);
    console.log(cookies.get("email"));
    console.log(cookies.get("log"));
    res.render("signin");
  });

  app.get("/signup", function(req, res) {
    res.render("signup");
  });

  app.get("/dashboard", function(req, res) {
    res.render("dashboard");
  });

  app.get("/profile", function(req, res) {
    res.render("profile");
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
