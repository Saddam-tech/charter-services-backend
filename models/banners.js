module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "banners",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      createdat: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn("current_timestamp"),
      },
      updatedat: {
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
      sequence: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      section: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      active: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      head: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "banners",
    }
  );
};
