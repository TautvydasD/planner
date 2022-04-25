function weightLogModel(sequelize, DataTypes) {
  return sequelize.define('weightLog', {
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bodyFat: {
      type: DataTypes.STRING,
      allowNull: true,
      default: '',
    },
    loggedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    fbWeightId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fbBodyFatId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
}

export { weightLogModel };
