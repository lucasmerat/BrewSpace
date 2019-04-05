// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

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

//Populate Beers Timeline
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
