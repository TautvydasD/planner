function workoutExerciseModel(sequelize, DataTypes) {
  return sequelize.define('workout_exercise', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'mine',
    },
    workoutId: DataTypes.INTEGER,
    exerciseId: DataTypes.INTEGER,
    reps: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
}

export { workoutExerciseModel };
