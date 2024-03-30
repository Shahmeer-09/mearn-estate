const express = require('express');
const verifyjwt = require('../middlewear/verifyjwt');
const {createlisting, deleteListing, getSelected, updateData, searchListing}= require('../controllers/listing.controller');
const router = express.Router();

router.post('/create',verifyjwt ,createlisting) 
router.delete('/delete/:id',verifyjwt ,deleteListing) 
router.post('/update/:id',verifyjwt ,updateData) 
router.get('/get/:id',getSelected) 
router.get('/get',searchListing) 

module.exports = router;