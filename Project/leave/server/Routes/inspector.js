const express = require('express');
const { sameDivision, statisticUsers, sameBothDivAndSubDiv, getUsers, getUserforEdit, updateLastStatistic, updateStatistic } = require('../Controllers/inspector');
const { authenticate } = require('../Middleware/auth');
const router = express.Router();


router.get('/sameDivision',authenticate, sameDivision);
router.get('/sameBothDivAndSubDiv',authenticate, sameBothDivAndSubDiv);
// router.get('/statisticUsers',authenticate, statisticUsers);
router.get('/getuser/:citizenID',authenticate, getUsers);
router.get('/getuserforEdit/:citizenID',authenticate, getUserforEdit);
router.put('/updateLastStatistic/:citizenID',authenticate, updateLastStatistic);

module.exports = router;
