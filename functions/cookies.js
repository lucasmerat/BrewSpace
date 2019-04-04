var cookies = {
  writeCookie: function(value, variable) {
    var now = new Date();
    now.setMonth(now.getMonth() + 1);
    cookievalue = value + ";";
    document.cookie =
      variable + "=" + cookievalue + "expires=" + now.toUTCString() + ";";
  },

  ReadCookie: function() {
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
  },

  deleteCookie: function(value, variable) {
    var now = new Date();
    now.setMonth(now.getMonth() - 1);
    cookievalue = value + ";";
    document.cookie =
      variable + "=" + cookievalue + "expires=" + now.toUTCString() + ";";
  }
};

module.exports = cookies;
