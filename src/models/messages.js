module.exports = (sequelize, DataType) => {
  const Messages = sequelize.define("Messages", {
    msg_id: {
      type: DataType.STRING,
      primaryKey: true,
      allowNull: false,
    },
    msg_body: {
      type: DataType.STRING,
      allowNull: false,
    },
    type: {
      type: DataType.STRING,
      allowNull: false,
    },
    notifyName: {
      type: DataType.STRING,
      allowNull: false,
    },
    msg_time: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    msg_act: {
      type: DataType.INTEGER,
      allowNull: false,
    },
  });

  Messages.associate = (models) => {
    Messages.belongsTo(models.Chats, {
      foreignKey: {
        name: "chat_id",
        allowNull: false,
      },
    });
  };

  return Messages;
};
