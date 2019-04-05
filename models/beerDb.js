module.exports = function(sequelize, DataTypes) {
  var Data = sequelize.define("Data", {
    // eslint-disable-next-line camelcase
    brewery_id: DataTypes.INTEGER,
    name: DataTypes.STRING(500),
    catId: DataTypes.INTEGER,
    styleId: DataTypes.INTEGER,
    abv: DataTypes.FLOAT,
    ibu: DataTypes.FLOAT,
    srm: DataTypes.FLOAT,
    upc: DataTypes.INTEGER,
    filepath: DataTypes.STRING(500),
    descript: DataTypes.STRING(10000),
    addUser: DataTypes.INTEGER,
    lastMod: DataTypes.DATE,
    createdAt: {
      type: DataTypes.DATE,
      field: "createdAt",
      defaultValue: sequelize.literal("NOW()")
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updatedAt",
      defaultValue: sequelize.literal("NOW()")
    }
  });
  return Data;
};
