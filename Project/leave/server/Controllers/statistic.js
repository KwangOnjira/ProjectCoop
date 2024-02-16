const express = require("express");
const app = express();
app.use(express.json());

const dbSeq = require("../Config/index");
const { users, statistic } = dbSeq;
dbSeq.sequelize.sync();

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

exports.statistic = async (req, res) => {
  const userId = req.userId;
  info = await statistic.findAll({ where: { citizenID: userId } });
  res.json(info);
};

exports.lastStatistic = async(req, res) =>{
  const userId = req.userId
  try {
    const last = await statistic.findOne({
      where:{citizenID:userId},order: [["statisticID", "DESC"]],
    })

    if (last) {
      return last.statisticID;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
}

exports.getDataLastStatistic = async(req,res) => {
  const userId = req.userId
  
  try {
      const getLastStatistic = await dbSeq.statistic.findOne({
        where:{citizenID:userId},order: [["statisticID", "DESC"]],
      })
        if (getLastStatistic) {
          console.log("getLastStatistic: ",getLastStatistic)
          return res.json(getLastStatistic)
        }
        else{
          return res.status(404).json({ error: 'Last statistic not found' });
        }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.createStatistic = async (req, res) => {
  const userId = req.userId;
  const {
    leave_rights,
    VL_accumulatedDays,
    VL_total,
    VL_lastLeave,
    VL_thisLeave,
    currentUseVL,
    VL_remaining,
    leave_count,
    SL_lastLeave,
    SL_thisLeave,
    SL_remaining,
    PL_lastLeave,
    PL_thisLeave,
    PL_remaining,
    ML_DayCount,
    OL_DayCount,
    STL_DayCount,
    total_leaveDay,
  } = req.body;

  try {
    const createStat = await dbSeq.statistic.create({
      citizenID:userId,
      leave_rights,
      VL_accumulatedDays,
      VL_total,
      VL_lastLeave,
      VL_thisLeave,
      currentUseVL,
      VL_remaining,
      leave_count,
      SL_lastLeave,
      SL_thisLeave,
      SL_remaining,
      PL_lastLeave,
      PL_thisLeave,
      PL_remaining,
      ML_DayCount,
      OL_DayCount,
      STL_DayCount,
      total_leaveDay
    });
    res.status(201).json(createStat);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

