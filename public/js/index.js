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

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
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

//Sign Up
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
  //Check for no empty inputs
  if (email === "" || password === "" || username === "") {
    return;
  }

  //Check username length
  if (username.length > 14) {
    alert("Username can't be longer than 14 characters");
    return;
  }

  //Check email format
  var emailValidation = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
  );
  if (!emailValidation.test(email)) {
    alert("Invalid email");
    return;
  }

  //Check password minimum requirements
  var passwordValidation = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/i
  );
  if (!passwordValidation.test(password)) {
    alert(
      "Password must be at least 8 characters; must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character "
    );
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
      console.log("Created new user");
      window.location.pathname = "/signin";
    }
  });
});

//Log In
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

function PopulateDashboard() {
  //Populate Top Beers
  if (path === "/dashboard") {
    $(".topBeers").html(
      "<li class='collection-header'><h4>Top Beers</h4></li>"
    );
    $.ajax("/api/beers/top", {
      type: "GET"
    }).then(function(Beers) {
      var limit = 50;
      if (Beers.length < limit) {
        limit = Beers.length;
      }
      for (var i = 0; i < limit; i++) {
        var item =
          "<li class='collection-item'><i class='fas fa-beer'></i> <span>" +
          Beers[i].Name +
          "</span>| Count:" +
          Beers[i].Quantity +
          "<a data-name=" +
          Beers[i].Name +
          " class='secondary-content'><a id='display-beer-info' class='modal-trigger' data-target='modal3'><i class='fas fa-info-circle grey-text'></i></a>";
        $(".topBeers").append(item);
      }
    });

    //Populate Beers Timeline
    $(".timelineUsers").html(
      "<li class='collection-header'><h4>Timeline</h4></li>"
    );
    $.ajax("/api/beers", {
      type: "GET"
    }).then(function(Beers) {
      var limit = 25;
      if (Beers.length < limit) {
        limit = Beers.length;
      }
      var BeerNames = [];
      var BeerTimes = [];
      var UserIds = [];
      var UserNames = [];
      var UserImages = [];
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
        console.log(User);
        for (var j = 0; j < limit; j++) {
          for (var i = 0; i < User.length; i++) {
            if (User[i].id === UserIds[j]) {
              UserNames.push(User[i].username);
              UserImages.push(User[i].image);
            }
            if (UserNames.length === limit) {
              console.log(UserNames[i]);
              for (var i = 0; i < limit; i++) {
                var item =
                  "<li class='collection-item avatar'><img class='responsive-img circle' src='" +
                  UserImages[i] +
                  "'></img><span class='title'>Username:" +
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
    $(".usernameTitle").text(username);

    // User total beers
    $.ajax("/api/users/total/" + username, {
      type: "GET"
    }).then(function(Total) {
      console.log(Total);
      $(".numbersTotal").text(Total);
    });

    //User image
    $.ajax("/api/users/getImage/" + username, {
      type: "GET"
    }).then(function(image) {
      console.log(image);
      $(".profile-image").attr("src", image.image);
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
          "<li class='collection-item'>" +
          Top[i].Name +
          "  <span class='right'><span class='fun-beer'>" +
          Top[i].Quantity +
          "</span> Drinks</span></li>";
        $(".userTop").append(item);
      }
      //In case there are no beers at all
      if (limit === 0) {
        var item =
          "<li> You haven't added any beers yet, log one above to get started</li>";
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
          "<li class='collection-item'><i class='fas fa-beer'></i><span> " +
          Timeline[i].name +
          " </span><a id='display-beer-info' class='modal-trigger' data-target='modal3'><i class='fas fa-info-circle grey-text'></i></a> <span class='right'>" +
          convertedDate.calendar() +
          "</span></li>";

        $(".userTimeline").append(item);
      }
    });
  }
}
PopulateDashboard();
PopulateUserProfile();

//Search Beer
$(document).on("click", ".search-beer", function(e) {
  e.preventDefault();
  var beerSearched = $("#beerSearched")
    .val()
    .trim();
  if (beerSearched === "") {
    return;
  }
  $.ajax("/api/data/" + beerSearched, {
    type: "GET"
  }).then(function(result) {
    $(".table-section").empty();
    $("#buttons-section").empty();

    if (result.length > 0 && beerSearched) {
      $(".table-section").append(
        "<table><thead><tr><th>Beer Name</th><th></th></tr></thead><tbody class='search-beer-list'></tbody></table>"
      );
      result.forEach(function(beer) {
        $(".search-beer-list").append(
          "<tr><td>" +
            beer.name +
            "</td><td><a id='log-drink' class='btn halfway-fab waves-effect waves-light orange right modal-close' data-id=" +
            beer.id +
            ">+</a></td></tr>"
        );
      });
      $("#buttons-section").append(
        "<button type='submit' class='search-beer btn-small'>Search for Beer</button><button data-target='modal2' id='add-to-db'class='btn-small halfway-fab waves-effect waves-light modal-close modal-trigger'>Add a beer to DB</button>"
      );
    } else {
      $(".table-section").append(
        "<p>Beer not found, try another, or add your own to our database</p>"
      );
      $("#buttons-section").append(
        "<button type='submit' class='search-beer btn-small'>Search for Beer</button><button data-target='modal2' id='add-to-db'class='btn-small halfway-fab waves-effect waves-light modal-close modal-trigger'>Add a beer to DB</button>"
      );
    }
  });
});

//Log Beer to user
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
    //Clean Log Beer section
    $(".table-section").empty();
    $("#beerSearched").val("");
    //Notification and reload data
    $("#notification").empty();
    notification("Beer logged!");
    PopulateDashboard();
    PopulateUserProfile();
  });
});

//Go to another user profile
$(document).on("click", "a", function() {
  var dataUser = $(this).attr("data-user");
  if (dataUser !== undefined) {
    window.location.pathname = "/profile/" + dataUser;
  }
});

//Add beer to DB
$(document).on("click", ".add-beer-data", function() {
  let beerName = $("#beer-data-name")
    .val()
    .trim();
  let beerDescription = $("#beer-data-description")
    .val()
    .trim();
  let beerAbv = $("#beer-data-abv")
    .val()
    .trim();

  //Check that beerName is not empy
  if (beerName === "") {
    $("#notification").empty();
    notification("Beer name can't be empty");
    console.log("Here");
    return;
  }
  beerName = titleCase(beerName);

  //Check if beer Description is empty
  if (beerDescription !== "") {
    beerDescription =
      beerDescription.charAt(0).toUpperCase() + beerDescription.slice(1);
  }

  $.ajax("/api/data", {
    type: "POST",
    data: {
      name: beerName,
      description: beerDescription,
      abv: beerAbv
    }
  }).then(function() {
    //Clean add beer to DB
    $("#beer-data-name").val("");
    $("#beer-data-description").val("");
    $("#beer-data-abv").val(0);
    //Notification and update info
    $("#notification").empty();
    notification("Beer Added to Database - try and log it again!");
    PopulateDashboard();
    PopulateUserProfile();
  });
});

//Show beer info
$(document).on("click", "#display-beer-info", function() {
  let beerName = $(this)
    .siblings()[1]
    .innerText.trim();
  $("#beer-info-title").text(beerName);
  $.ajax("/api/data/display/" + beerName, {
    type: "GET"
  }).then(function(result) {
    console.log(result);
    if (result.descript) {
      $("#beer-description-modal").text(result.descript);
    } else {
      $("#beer-description-modal").text("No description available");
    }
    if (result.abv) {
      $("#abv").text("ABV: " + result.abv + "%");
    } else {
      $("#abv").text("ABV: No ABV data available");
    }
  });
});

$(".change-photo").on("click", function() {
  $(".change-photo").css("display", "none");
  $(".add-photo-section").append(
    "<p>Please enter a valid link to a photo in the box below</p><input id='add-image-url' type='url' placeholder='https://website.png' /><button id='save-photo' class='btn-small'>Save photo</button"
  );
});

$(document).on("click", "#save-photo", function() {
  console.log("Clicked");
  let imageUrl = $("#add-image-url")
    .val()
    .trim();
  let userName = ReadCookie().username;
  $.ajax("/api/users/addImage", {
    type: "PUT",
    data: {
      imageUrl,
      userName
    }
  }).then(function() {
    console.log("Clearing");

    $(".profile-image").attr("src", imageUrl);
    $(".add-photo-section").empty();
    $(".add-photo-section").append(
      "<a class='change-photo'>Change profile picture</a>"
    );
  });
 });

//Go to your profile
$(document).on("click", ".viewProfile", function() {
  window.location.pathname = "/profile";
});
