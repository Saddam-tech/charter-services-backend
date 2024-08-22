module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "admin_accounts",
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
      firstname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      active: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
      },
      uuid: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "admin_accounts",
      timestamps: false,
    }
  );
};
