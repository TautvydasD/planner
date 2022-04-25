function foodLogModel(sequelize, DataTypes) {
  return sequelize.define('foodLog', {
    calories: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    loggedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  });
}

export { foodLogModel };
