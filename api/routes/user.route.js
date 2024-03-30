const express  = require('express');
const verifyjwt = require('../middlewear/verifyjwt')
const router = express.Router()
const {updateuser, deleteUser, getListings, getLandlordData} = require('../controllers/usercontroller');

router.post('/update/:id',verifyjwt,  updateuser)
router.delete('/delete/:id',verifyjwt,  deleteUser)
router.get('/listings/:id',verifyjwt,  getListings)
router.get('/:id',verifyjwt,  getLandlordData)
module.exports= router;