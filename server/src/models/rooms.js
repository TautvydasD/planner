/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/models/rooms
*
*/
function roomModel(sequelize, DataTypes) {
  return sequelize.define('room', {
    toClientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
}

export { roomModel };
