const express = require('express');
const { statistic,createStatistic,lastStatistic, getDataLastStatistic, createVLInit } = require('../Controllers/statistic');
const { authenticate } = require('../Middleware/auth');
const router = express.Router()

router.post("/createStat", authenticate, createStatistic);
router.get("/statistics", authenticate, statistic);
router.get("/lastStatistic", authenticate,lastStatistic);
router.get("/getDataLastStatistic", authenticate,getDataLastStatistic);

module.exports = router