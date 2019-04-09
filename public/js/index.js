var path = window.location.pathname;
let notification = function(message) {
  $("#notification")
    .fadeIn("slow")
    .append(message);
  setTimeout(function() {
    $("#notification").fadeOut("slow");
  }, 3000);
};

function writeCookie(value, variable) {
  var now = new Date();
  now.setMonth(now.getMonth() + 1);
  cookievalue = value + ";";
  document.cookie =
    variable + "=" + cookievalue + "expires=" + now.toUTCString() + "; path=/";
}

function ReadCookie() {
  var allcookies = document.cookie;

  // Get all the cookies pairs in an array
  var cookiearray = [];
  if (allcookies.length > 1) {
    cookiearray = allcookies.split(";");
  }
  // Now take key value pair out of this array
  if (cookiearray.length > 0) {
    username = cookiearray[0].split("=")[1];
    log = cookiearray[1].split("=")[1];
    return { username: username, log: log };
  } else {
    return { log: false };
  }
}

function deleteCookie(value, variable) {
  var now = new Date();
  now.setMonth(now.getMonth() - 1);
  cookievalue = value + ";";
  document.cookie =
    variable + "=" + cookievalue + "expires=" + now.toUTCString() + "; path=/";
}
//Log Out,
$(".logout").on("click", function(event) {
  console.log("Logout button clicked");
  event.preventDefault();
  var logged = ReadCookie();
  deleteCookie(logged.username, "username");
  deleteCookie(logged.log, "log");
  console.log("Cookie Deleted");
  window.location.pathname = "";
});

$(".create-user").on("submit", function(event) {
  // Make sure to preventDefault on a submit event.
  event.preventDefault();
  console.log("Click");
  var email = $("#email")
    .val()
    .trim();
  var password = $("#password")
    .val()
    .trim();
  var username = $("#userName")
    .val()
    .trim();
  if (email === "" || password === "" || username === "") {
    return;
  }

  var newUser = {
    username: username,
    email: email,
    password: password
  };

  // Send the POST request.
  $.ajax("/api/signup", {
    type: "POST",
    data: newUser
  }).then(function(signup) {
    if (!signup) {
      alert("Username or email already in use");
    } else {
      console.log(signup);
      console.log("Created new user");
      window.location.pathname = "/signin";
    }
  });
});

$(".login-user").on("submit", function(event) {
  // Make sure to preventDefault on a submit event.
  event.preventDefault();
  var email = $("#emailLog")
    .val()
    .trim();
  var password = $("#passwordLog")
    .val()
    .trim();
  if (email === "" || password === "") {
    return;
  }

  var User = {
    email: email,
    password: password
  };

  // Send the POST request.
  $.ajax("/api/signin", {
    type: "POST",
    data: User
  }).then(function(logged) {
    if (logged.status) {
      console.log("User has logged");
      writeCookie(logged.username, "username");
      writeCookie(logged.status, "log");
      window.location.pathname = "/dashboard";
    } else {
      console.log("Wrong Input");
      alert("Wrong email or password");
    }
  });
});

//Check if is already logged
var logged = ReadCookie();
if (logged.username !== undefined) {
  console.log("Already logged");
} else {
  console.log("No one is logged");
}
console.log(ReadCookie());

function PopulateDashboard() {
  //Populate Top Beers
  if (path === "/dashboard") {
    $(".topBeers").html(
      "<li class='collection-header'><h4>Timeline For All Users</h4></li>"
    );
    $.ajax("/api/beers/top", {
      type: "GET"
    }).then(function(Beers) {
      var limit = 5;
      if (Beers.length < limit) {
        limit = Beers.length;
      }
      for (var i = 0; i < limit; i++) {
        var item =
          "<li class='collection-item'><div>" +
          Beers[i].Name +
          "| Count:" +
          Beers[i].Quantity +
          "<a data-name=" +
          Beers[i].Name +
          " class='secondary-content'><i class='material-icons'>Info</i></a></div></li>";
        $(".topBeers").append(item);
      }
    });

    //Populate Beers Timeline
    $(".timelineUsers").html(
      "<li class='collection-header'><h4>Top Beers From All Users</h4></li>"
    );
    $.ajax("/api/beers", {
      type: "GET"
    }).then(function(Beers) {
      var limit = 5;
      if (Beers.length < limit) {
        limit = Beers.length;
      }
      var BeerNames = [];
      var BeerTimes = [];
      var UserIds = [];
      var UserNames = [];
      for (var i = 0; i < limit; i++) {
        BeerNames.push(Beers[i].name);
        var convertedDate = moment(
          Beers[i].createdAt,
          "YYYY-MM-DD[T]HH:mm:ss.sssZ"
        );
        BeerTimes.push(convertedDate.calendar());
        UserIds.push(Beers[i].UserId);
      }

      $.ajax("/api/users/", {
        type: "GET"
      }).then(function(User) {
        for (var j = 0; j < limit; j++) {
          for (var i = 0; i < User.length; i++) {
            if (User[i].id === UserIds[j]) {
              UserNames.push(User[i].username);
            }
            if (UserNames.length === limit) {
              for (var i = 0; i < limit; i++) {
                var item =
                  "<li class='collection-item avatar'><i class='material-icons circle green'>insert_chart</i><span class='title'>Username:" +
                  UserNames[i] +
                  " </span><p>Beer Drank:" +
                  BeerNames[i] +
                  "<br>Time:" +
                  BeerTimes[i] +
                  " <br>Location: <i class='fas fa-1x fa-map-marker-alt text-orange mb-4'></i></p><a data-user=" +
                  UserNames[i] +
                  " class='secondary-content'><i class='material-icons'>View Profile</i></a></li>";
                $(".timelineUsers").append(item);
              }
            }
          }
        }
      });
    });
  }
}
function PopulateUserProfile() {
  if (path === "/profile") {
    $(".userTop").empty();
    $(".userTimeline").empty();
    var username = ReadCookie().username;
    console.log(username);
    $(".usernameTitle").text(username);

    // User total beers
    $.ajax("/api/users/total/" + username, {
      type: "GET"
    }).then(function(Total) {
      $(".numbersTotal").text(Total);
    });

    //User top Beers & Unique Beers
    $.ajax("/api/users/top/" + username, {
      type: "GET"
    }).then(function(Top) {
      $(".numbersUnique").text(Top.length);
      var limit = 3;
      if (Top.length < limit) {
        limit = Top.length;
      }
      $(".numberTop").text(limit);
      for (var i = 0; i < limit; i++) {
        var item =
          "<li>" + Top[i].Name + " - " + Top[i].Quantity + " Drinks</li>";
        $(".userTop").append(item);
      }
    });

    //User Timeline
    $.ajax("/api/users/timeline/" + username, {
      type: "GET"
    }).then(function(Timeline) {
      var limit = 5;
      if (Timeline.length < limit) {
        limit = Timeline.length;
      }
      for (var i = 0; i < limit; i++) {
        var convertedDate = moment(
          Timeline[i].createdAt,
          "YYYY-MM-DD[T]HH:mm:ss.sssZ"
        );
        var item =
          "<li class='collection-item'><i class='fas fa-beer'></i> " +
          Timeline[i].name +
          " <a id='display-beer-info modal-trigger' data-target='modal3'><i class='fas fa-question-circle grey-text'></i></a> <span class='right'>" +
          convertedDate.calendar() +
          "</span></li>";
        $(".userTimeline").append(item);
      }
    });
  }
}
PopulateDashboard();
PopulateUserProfile();

$(".search-beer").on("click", function() {
  console.log("Search beer button clicked");
  var beerSearched = $("#beerSearched")
    .val()
    .trim();
  $.ajax("/api/data/" + beerSearched, {
    type: "GET"
  }).then(function(result) {
    $(".table-section").empty();
    if (result.length > 0) {
      $(".table-section").append(
        "<table><thead><tr><th>Beer Name</th><th></th></tr></thead><tbody class='search-beer-list'></tbody></table>"
      );
      result.forEach(function(beer) {
        console.log(beer);
        $(".search-beer-list").append(
          "<tr><td>" +
            beer.name +
            "</td><td><a id='log-drink' class='btn halfway-fab waves-effect waves-light orange right modal-close' data-id=" +
            beer.id +
            ">+</a></td></tr>"
        );
      });
    } else {
      $(".table-section").append(
        "<p>Beer not found, try another, or add your own to our database</p><button data-target='modal2' id='add-to-db'class='btn halfway-fab waves-effect waves-light orange modal-close modal-trigger'>Add beer to database</button>"
      );
    }

    console.log(result);
  });
});

$(document).on("click", "#log-drink", function() {
  var username = ReadCookie().username;
  var dataId = $(this).attr("data-id");
  $.ajax("/api/users/addDrink", {
    type: "PUT",
    data: {
      username: username,
      dataId: dataId
    }
  }).then(function() {
    // var path = window.location.pathname;
    // window.location.pathname = path;
    $("#notification").empty();
    notification("Beer logged!");
    PopulateDashboard();
    PopulateUserProfile();
  });
});

$(document).on("click", "a", function() {
  var dataUser = $(this).attr("data-user");
  if (dataUser !== undefined) {
    window.location.pathname = "/profile/" + dataUser;
  }
});

$(document).on("click", ".add-beer-data", function() {
  let beerName = $("#beer-data-name")
    .val()
    .trim();
  let beerDescription = $("#beer-data-description")
    .val()
    .trim();

  $.ajax("/api/data", {
    type: "POST",
    data: {
      name: beerName,
      description: beerDescription
    }
  }).then(function() {
    $("#notification").empty();
    notification("Beer Added to Database - try and log it again!");
    PopulateDashboard();
    PopulateUserProfile();
  });
});

$(document).on("click", "#display-beer-info", function(){
  console.log("Clicked!");
});
