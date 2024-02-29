module.exports = (sequelize, DataType) => {
  const Chats = sequelize.define("Chats", {
    chat_id: {
      type: DataType.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    chat_creator: {
      type: DataType.STRING,
      allowNull: false,
    },
    chat_status: {
      type: DataType.INTEGER,
      allowNull: false,
    },
  });

  Chats.associate = (models) => {
    Chats.hasMany(models.Messages, {
      foreignKey: {
        name: "chat_id",
        allowNull: false,
      },
    });
  };

  return Chats;
};
