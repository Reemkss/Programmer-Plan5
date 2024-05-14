/*password*** */
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    picture: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  });

  user.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash();
  });

  user.prototype.generatePasswordHash = function () {
    if (this.password) {
      return bcrypt.hash(this.password, 10);
    }
  };

  return user;
};
