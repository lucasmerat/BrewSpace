module.exports = function(sequelize, DataTypes) {
  var Beer = sequelize.define("Beer", {
    name: DataTypes.STRING
  });

  Beer.associate = function(models) {
    Beer.belongsToMany(models.User, {
      through: "userbeers"
    });
  };
  return Beer;
};
