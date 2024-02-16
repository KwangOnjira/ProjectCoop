const express = require('express');
const { leave,getLeave,getLeaveById } = require('../Controllers/leave');
const { authenticate } = require('../Middleware/auth');
const { upload } = require('../Middleware/upload');
const router = express.Router()

router.post("/leave/:type",authenticate,leave)
router.get("/getLeave",authenticate,getLeave)
router.get("/getLeaveById/:statid",authenticate,getLeaveById)

module.exports = router