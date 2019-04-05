var db = require("../models");
var Cookies = require("cookies");

module.exports = function(app) {
  // var email = cookies.get("email");

  // Load landing page
  app.get("/", function(req, res) {
    var cookies = new Cookies(req, res);
    var log = cookies.get("log");
    console.log(log);
    if (log) {
      res.redirect("/dashboard");
    } else {
      res.render("index");
    }
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

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
