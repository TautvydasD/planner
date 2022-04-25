function exerciseModel(sequelize, DataTypes) {
  return sequelize.define('exercise', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    muscles: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    muscles_secondary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    access_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    equipment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
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
  });
}

export { exerciseModel };
