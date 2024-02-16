const express = require("express");
const app = express();
app.use(express.json());

const dbSeq = require("../Config/index");
const { holiday } = dbSeq;
dbSeq.sequelize.sync();

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

exports.getHoliday = async (req, res) => {
  try {
    const data = await holiday.findAll({});
    res.json(data);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
