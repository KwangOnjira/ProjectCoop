module.exports = (sequelize, Sequelize) => {
    const statistic = sequelize.define(
      "statistic",
      {
        statisticID: {
          type: Sequelize.INTEGER(11),
          primaryKey: true,
          field: "statisticID",
        },
        leave_rights: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          field: "leave_rights",
        },
        VL_accumulatedDays: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          field: "VL_accumulatedDays",
        },
        VL_total: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          field: "VL_total",
        },
        VL_lastLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "VL_lastLeave",
        },
        VL_thisLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "VL_thisLeave",
        },
        currentUseVL: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "currentUseVL",
        },
        VL_remaining: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "VL_remaining",
        },
        leave_count: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          field: "leave_count",
        },
        SL_lastLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "SL_lastLeave",
        },
        SL_thisLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "SL_thisLeave",
        },
        SL_remaining: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "SL_remaining",
        },
        PL_lastLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "PL_lastLeave",
        },
        PL_thisLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "PL_thisLeave",
        },
        PL_remaining: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "PL_remaining",
        },
        ML_DayCount: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "ML_DayCount",
        },
        OL_DayCount: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "OL_DayCount",
        },
        STL_DayCount: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "STL_DayCount",
        },
        total_leaveDay: {
          type: Sequelize.FLOAT,
          allowNull: false,
          field: "total_leaveDay",
        },
      },
      {
        tableName: "statistic",
      }
    );
  
    return statistic;
  };
  