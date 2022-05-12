/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/models/clients
*
*/
function clientModel(sequelize, DataTypes) {
  return sequelize.define('client', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    coach: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    socketId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      allowNull: false,
      defaultValue: new Date(),
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      defaultValue: new Date(),
      type: DataTypes.DATE,
    },
    water: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    calories: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    verified: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER,
    },
    verificationHash: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    hasFitbit: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    useFitbit: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    height: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  });
}

export { clientModel };
