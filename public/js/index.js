var path = window.location.pathname;

function writeCookie(value, variable) {
  var now = new Date();
  now.setMonth(now.getMonth() + 1);
  cookievalue = value + ";";
  document.cookie =
    variable + "=" + cookievalue + "expires=" + now.toUTCString() + ";";
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
    email = cookiearray[0].split("=")[1];
    log = cookiearray[1].split("=")[1];
    return { email: email, log: log };
  } else {
    return { log: false };
  }
}

function deleteCookie(value, variable) {
  var now = new Date();
  now.setMonth(now.getMonth() - 1);
  cookievalue = value + ";";
  document.cookie =
    variable + "=" + cookievalue + "expires=" + now.toUTCString() + ";";
}
//Log Out,
$(".logout").on("click", function(event) {
  console.log("Logout button clicked");
  event.preventDefault();
  var logged = ReadCookie();
  deleteCookie(logged.email, "email");
  deleteCookie(logged.log, "log");
  window.location.pathname = "/";
});

$(".create-user").on("submit", function(event) {
  // Make sure to preventDefault on a submit event.
  event.preventDefault();
  var email = $("#email")
    .val()
    .trim();
  var password = $("#password")
    .val()
    .trim();
  if (email === "" || password === "") {
    return;
  }

  var newUser = {
    email: email,
    password: password
  };

  // Send the POST request.
  $.ajax("/api/signup", {
    type: "POST",
    data: newUser
  }).then(function() {
    console.log("Created new user");
    window.location.pathname = "/signin";
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
      writeCookie(logged.email, "email");
      writeCookie(logged.status, "log");
      window.location.pathname = "/dashboard";
    } else {
      console.log("Wrong Input");
    }
  });
});

//Check if is already logged
var logged = ReadCookie();
if (logged.email !== undefined) {
  console.log("Already logged");
} else {
  console.log("No one is logged");
}
console.log(ReadCookie());

//Populate Top Beers
if (path === "/dashboard") {
  $.ajax("/api/beers/top", {
    type: "GET"
  }).then(function(Beers) {
    var Quantity = 5;
    if (Beers.length < Quantity) {
      Quantity = Beers.length;
    }
    for (var i = 0; i < Quantity; i++) {
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
}

//Populate Beers Timeline
if (path === "/dashboard") {
  $.ajax("/api/beers", {
    type: "GET"
  }).then(function(Beers) {
    var Quantity = 5;
    if (Beers.length < Quantity) {
      Quantity = Beers.length;
    }
    var BeerNames = [];
    var BeerTimes = [];
    var UserNames = [];
    for (var i = 0; i < Quantity; i++) {
      BeerNames.push(Beers[i].name);
      BeerTimes.push(Beers[i].createdAt);
      var UserPath = "/api/users/" + Beers[i].UserId;
      $.ajax(UserPath, {
        type: "GET"
      }).then(function(User) {
        //Needs to be changed to username once we have it
        UserNames.push(User.email);
      });
    }

    //Create Table
    setTimeout(function() {
      for (var i = 0; i < Quantity; i++) {
        var item =
          "<li class='collection-item avatar'><i class='material-icons circle green'>insert_chart</i><span class='title'>Username:" +
          UserNames[i] +
          " </span><p>Beer Drank:" +
          BeerNames[i] +
          "<br>Time:" +
          Beers[i].createdAt +
          " <br>Location: <i class='fas fa-1x fa-map-marker-alt text-orange mb-4'></i></p><a data-user=" +
          UserNames[i] +
          " class='secondary-content'><i class='material-icons'>View Profile</i></a></li>";
        $(".timelineUsers").append(item);
      }
    }, 300);
  });
}

$(".search-beer").on("click", function() {
  let beerSearched = $("#beerSearched").val().trim();
  $.ajax("/api/data/" + beerSearched, {
    type: "GET"
  }).then(function(result){
    $(".table-section").append(`
    <table>
      <thead>
        <tr>
          <th>Beer Name</th>
        </tr>
      </thead>
      <tbody>
      
      </tbody>
    </table>
`)
    console.log(result)
  })
});
