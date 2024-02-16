const express = require('express');
const { register, login, profile, getProfile, currentUser, } = require('../Controllers/auth');
const { authenticate, adminCheck, inspectorCheck, superiorCheck } = require('../Middleware/auth');
const router = express.Router()

router.post("/register", register);
router.post("/login", login );
router.put("/profile", authenticate, profile);
router.get("/getProfile", authenticate, getProfile);
router.post("/currentUser",authenticate, currentUser);
router.post("/currentAdmin",authenticate,adminCheck, currentUser);
router.post("/currentInspector",authenticate,inspectorCheck, currentUser);
router.post("/currentSuperior",authenticate,superiorCheck, currentUser);

module.exports = router