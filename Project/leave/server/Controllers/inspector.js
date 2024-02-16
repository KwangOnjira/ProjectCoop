const express = require("express");
const app = express();
app.use(express.json());

const dbSeq = require("../Config/index");
const { users } = dbSeq;
dbSeq.sequelize.sync();

const dotenv = require("dotenv");
const statistic = require("../Models/statistic");
dotenv.config({ path: "./.env" });

exports.sameDivision = async (req, res) => {
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });
    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const usersWithSameDivision = await dbSeq.users.findAll({
      where: { divisionName: userdata.dataValues.divisionName },
      include: {
        model: dbSeq.statistic,
        order: [["statisticID", "DESC"]],
        limit: 1,
      },
    });

    console.log("usersWithSameDivision: ", usersWithSameDivision);
    res.json(usersWithSameDivision);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.sameBothDivAndSubDiv = async (req, res) => {
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });

    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );

    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.sub_division
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const sameBothDivAndSubDiv = await dbSeq.users.findAll({
      where: {
        divisionName: userdata.dataValues.divisionName,
        sub_division: userdata.dataValues.sub_division,
      },
      include: {
        model: dbSeq.statistic,
        order: [["statisticID", "DESC"]],
        limit: 1,
      },
    });

    console.log("sameBothDivAndSubDiv: ", sameBothDivAndSubDiv);
    res.json(sameBothDivAndSubDiv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const citizenID = req.params.citizenID;
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: citizenID },
      include: [{ model: dbSeq.statistic }, { model: dbSeq.leave }],
    });
    console.log("userdata: ", userdata);
    res.json(userdata);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserforEdit = async (req, res) => {
  try {
    const citizenID = req.params.citizenID;
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: citizenID },
      include: [
        { model: dbSeq.statistic, order: [["statisticID", "DESC"]], limit: 1 },
      ],
    });
    console.log("userdata: ", userdata);
    res.json(userdata);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateLastStatistic = async (req, res) => {
  const {
      leave_rights,
      VL_accumulatedDays,
      VL_total,
      VL_lastLeave,
      VL_thisLeave,
      SL_remaining,
      PL_remaining,
      ML_DayCount,
      OL_DayCount,
      STL_DayCount,
    } = req.body;
  try {
    const citizenID = req.params.citizenID;
    console.log("Received citizenID:", citizenID);
    
    const latestStatistic = await dbSeq.statistic.findOne({
      where: { citizenID: citizenID },
      order: [["statisticID", "DESC"]], limit: 1 
    });

    console.log("latestStatistic: ", latestStatistic);

    if (!latestStatistic) {
      return res.status(404).json({ message: "User not Found" });
    }

    const updatedVL_remaining = VL_total - VL_lastLeave;
    const updatedcurrentUserVL = VL_lastLeave + VL_thisLeave;
    
    const [updateStat] = await dbSeq.statistic.update({
      leave_rights,
      VL_accumulatedDays,
      VL_total,
      VL_lastLeave,
      currentUseVL:updatedcurrentUserVL,
      VL_remaining:updatedVL_remaining,
      SL_remaining,
      PL_remaining,
      ML_DayCount,
      OL_DayCount,
      STL_DayCount,
    },{
      where: { statisticID: latestStatistic.statisticID },

    });

    // if(updateStat === 0){
    //   return res.status(404).json({ message: "User not Found" });
    // }

    console.log("Rows updated: ", updateStat);

    res.json({updateStat});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};
