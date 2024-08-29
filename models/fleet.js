/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "fleet",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      model_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      brand_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      seats: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
      },
      uuid: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      active: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "fleet",
      timestamps: true,
    }
  );
};
