const express = require('express');
const { getHoliday } = require('../Controllers/holiday');
const { authenticate } = require('../Middleware/auth');
const router = express.Router()

router.get("/getHoliday",authenticate,getHoliday)

module.exports = router