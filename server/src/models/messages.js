/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/models/messages
*
*/
function messageModel(sequelize, DataTypes) {
  return sequelize.define('message', {
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}

export { messageModel };
