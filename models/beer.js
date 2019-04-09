module.exports = function(sequelize, DataTypes) {
  var Beer = sequelize.define("Beer", {
    name: {
      type: DataTypes.STRING,
      validate: {
        min: 1
      }
    }
  });

  Beer.associate = function(models) {
    Beer.belongsToMany(models.User, {
      through: "userbeers"
    });
  };
  return Beer;
};
