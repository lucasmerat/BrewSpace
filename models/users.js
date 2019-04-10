module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 14]
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        is: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      }
    },
    password: {
      type: DataTypes.TEXT,
      validate: {
        min: 1
      }
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: "../img/user.png",
      validate: {
        is: /\.(gif|jpg|jpeg|tiff|png)$/i
      }
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Beer, {
      onDelete: "cascade"
    });
  };
  return User;
};
