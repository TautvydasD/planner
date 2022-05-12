/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/models/workouts
*
*/
function workoutModel(sequelize, DataTypes) {
  return sequelize.define('workout', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sets: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    access_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
}

export { workoutModel };
