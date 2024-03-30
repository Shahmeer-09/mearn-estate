const express = require('express');
const router = express.Router();
const {refreshhandler} = require("../controllers/refreshtoken");

router.get("/", refreshhandler);
module.exports = router;