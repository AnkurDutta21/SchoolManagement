const express = require('express')
const authHandler = require("../middleware/authHandler");
const { getFinancials, getGenderDistribution } = require('../controller/analytics');
const router = express.Router();


router.get('/financials',authHandler,getFinancials)
router.get('/genderDistribution/:id',authHandler,getGenderDistribution)

module.exports = router;