const { Sequelize } = require('sequelize')
require("dotenv").config('../.env');

const sequelize = new Sequelize(
    'request_leave',
    'root',
    '',
    {
        host:'localhost',
        dialect:'mysql',
        define:{
            timestamps: false
        }
    }
);

const dbSeq = {};

dbSeq.Sequelize = Sequelize;
dbSeq.sequelize = sequelize;

dbSeq.users = require('../Models/users')(sequelize,Sequelize);
dbSeq.statistic = require('../Models/statistic')(sequelize,Sequelize);
dbSeq.leave = require('../Models/leave')(sequelize,Sequelize);
dbSeq.sickleave = require('../Models/typeleave/sickleave')(sequelize,Sequelize);
dbSeq.personalleave = require('../Models/typeleave/personalleave')(sequelize,Sequelize);
dbSeq.vacationleave = require('../Models/typeleave/vacationleave')(sequelize,Sequelize);
dbSeq.maternityleave = require('../Models/typeleave/maternityleave')(sequelize,Sequelize);
dbSeq.ordinationleave = require('../Models/typeleave/ordinationleave')(sequelize,Sequelize);
dbSeq.studyleave = require('../Models/typeleave/studyleave')(sequelize,Sequelize);
dbSeq.holiday = require('../Models/holiday')(sequelize,Sequelize);


dbSeq.users.hasMany(
    dbSeq.statistic,
    {
        foreignKey:{name:'citizenID', field:'citizenID'}
    }
);

dbSeq.users.hasMany(
    dbSeq.leave,
    {
        foreignKey:{name:'citizenID', field:'citizenID'}
    }
)

dbSeq.statistic.hasOne(
    dbSeq.leave,
    {
        foreignKey:{name:'statisticID', field:'statisticID'}
    }
)

dbSeq.statistic.belongsTo(dbSeq.users,{foreignKey:'citizenID'});
dbSeq.leave.belongsTo(dbSeq.users,{foreignKey:'citizenID'});
dbSeq.leave.belongsTo(dbSeq.statistic,{foreignKey:'statisticID'})

dbSeq.sickleave.belongsTo(dbSeq.leave,{foreignKey:'leaveID'})
dbSeq.vacationleave.belongsTo(dbSeq.leave,{foreignKey:'leaveID'})
dbSeq.personalleave.belongsTo(dbSeq.leave,{foreignKey:'leaveID'})
dbSeq.maternityleave.belongsTo(dbSeq.leave,{foreignKey:'leaveID'})
dbSeq.ordinationleave.belongsTo(dbSeq.leave,{foreignKey:'leaveID'})
dbSeq.studyleave.belongsTo(dbSeq.leave,{foreignKey:'leaveID'})


module.exports = dbSeq