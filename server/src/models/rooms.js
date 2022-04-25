function roomModel(sequelize, DataTypes) {
  return sequelize.define('room', {
    toClientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
}

export { roomModel };
