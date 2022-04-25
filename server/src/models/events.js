function eventModel(sequelize, DataTypes) {
  return sequelize.define('event', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Event name cannot be null',
        },
      },
    },
    type: {
      type: DataTypes.ENUM('workout', 'meal', 'job', 'activity'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Event type cannot be null',
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activityId: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   notNull: {
      //     msg: 'Event activity id cannot be null',
      //   },
      // },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Event start time cannot be null',
        },
      },
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Event end time cannot be null',
        },
      },
    },
  });
}

export { eventModel };
