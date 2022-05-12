/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/models/waterLogs
*
*/
function waterLogModel(sequelize, DataTypes) {
  return sequelize.define('waterLog', {
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loggedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    unit: {
      type: DataTypes.STRING,
      defaultValue: 'ml',
    },
    fitbitId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
}

export { waterLogModel };
