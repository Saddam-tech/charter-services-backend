/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      createdat: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("current_timestamp"),
      },
      updatedat: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      active: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
      userid: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      orderid: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      n_ppl: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      pickup_location: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      dropoff_location: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      car_type: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      special_req: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
    }
  );
};
