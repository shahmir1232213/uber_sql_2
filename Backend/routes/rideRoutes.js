const express = require('express')
const router = express.Router()
const {query,body} = require('express-validator')
const rideController = require('../controllers/rideController')
const authMiddleWare = require('../middleware/isLoggedInUser')
const authMiddleWare_Captin = require('../middleware/isLoggedInCaptin')

router.post('/create',authMiddleWare,
    rideController.createRide
)

router.get('/get-fare',authMiddleWare,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',authMiddleWare_Captin,
       rideController.confirmRide
)

router.post('/start-ride',authMiddleWare_Captin,
       body('rideId').isMongoId().withMessage('Invalid MongoDB Id'),
       rideController.startRide
)
router.post('/end-ride',authMiddleWare_Captin,
        rideController.endRide
)
router.post('/cancel',authMiddleWare,
            rideController.cancelRide
)

module.exports = router;