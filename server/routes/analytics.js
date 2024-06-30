const express = require('express')
const authHandler = require("../middleware/authHandler");
const { getFinancials, getGenderDistribution, getTotalCounts } = require('../controller/analytics');
const router = express.Router();


router.get('/financials',authHandler,getFinancials)
router.get('/genderDistribution/:id',authHandler,getGenderDistribution)
router.get('/getTotalCounts',authHandler,getTotalCounts)

module.exports = router;