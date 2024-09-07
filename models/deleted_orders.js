/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "deleted_orders",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("current_timestamp"),
      },
      updated_at: {
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
      status: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "deleted_orders",
      timestamps: false,
    }
  );
};
