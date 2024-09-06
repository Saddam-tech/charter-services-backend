module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "services",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn("current_timestamp"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn("current_timestamp"),
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      uuid: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      active: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      head: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "services",
      timestamps: false,
    }
  );
};
