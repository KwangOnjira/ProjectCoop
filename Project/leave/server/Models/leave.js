const { sequelize, Sequelize } = require("../Config");

module.exports = (sequelize, Sequelize) => {
  const leave = sequelize.define(
    "leave",
    {
      leaveID: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        field: "leaveID",
        
      },
      topic: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "topic",
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "type",
      },
      to: {
        type: Sequelize.STRING(25),
        allowNull: false,
        field: "to",
      },
      date: { type: Sequelize.DATE, allowNull: false, field: "date" },
      contact: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "contact",
      },
      firstDay: { type: Sequelize.DATE, allowNull: false, field: "firstDay" },
      lastDay: { type: Sequelize.DATE, allowNull: false, field: "lastDay" },
      numDay: { type: Sequelize.FLOAT, allowNull: false, field: "numDay" },
      status: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "status",
      },
      allow: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: "allow",
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "comment",
      },
      typeCount: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "typeCount",
      },
    },
    {
      tableName: "leave",
    }
  );

  return leave;
};







