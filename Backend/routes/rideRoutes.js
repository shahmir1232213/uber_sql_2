const express = require('express')
const router = express.Router()
const {query,body} = require('express-validator')
const rideController = require('../controllers/rideController')
const authMiddleWare = require('../middleware/isLoggedInUser')
const authMiddleWare_Captin = require('../middleware/isLoggedInCaptin')

router.post('/create',authMiddleWare,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    //body('fare').isNumeric().withMessage('Fare must be a number'),
    rideController.createRide
)

router.get('/get-fare',authMiddleWare,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',authMiddleWare_Captin,
       body('rideId').isMongoId().withMessage('Invalid MongoDB Id'),
       rideController.confirmRide
)

router.post('/start-ride',authMiddleWare_Captin,
       body('rideId').isMongoId().withMessage('Invalid MongoDB Id'),
       rideController.startRide
)

router.post('/cancel',authMiddleWare_Captin,
            rideController.cancelRide
)

module.exports = router;