const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/isLoggedInUser'); // This is your middleware function
const mapController = require('../controllers/mapController');
const { query } = require('express-validator');

router.get(
  '/get-coordinates',
  query('address').isString().isLength({ min: 3 }),
  authMiddleware, // Use the function directly, not authMiddleware.authUser
  mapController.getCoordinates
);

router.get('/get-distance',
        query('origin').isString().isLength({min:3}),
        query('destination').isString().isLength({min:3}),
        authMiddleware,
        mapController.getDistanceTime
)

router.get('/get-suggestions',
           query('input').isString().isLength({min:3}),
           authMiddleware,
           mapController.getSuggestions
)

module.exports = router;
