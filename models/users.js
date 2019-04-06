module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT
  });

  User.associate = function(models) {
    User.hasMany(models.Beer, {
      onDelete: "cascade"
    });
  };
  return User;
};
