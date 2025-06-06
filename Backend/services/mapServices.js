const axios = require('axios');
//const captainModel = require('../models/captinModel');
const sql = require('mssql/msnodesqlv8');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GO_MAP_PRO_SECRETKEY;
    const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
   console.log("url: ",url)
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            //console.log("response.data: ",response.data)
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GO_MAP_PRO_SECRETKEY;

    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[ 0 ].elements[ 0 ];
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input)=>{
    if(!input){
        throw new Error('input required')
    }
    const apiKey = process.env.GO_MAP_PRO_SECRETKEY;
    console.log("API KEY: ",apiKey)
    const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try{
        const response = await  axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    }
    catch(err){
        console.error(err);
        throw err;
    }
}

module.exports.getCaptinInTheRadius = async (lat, lng, radiusKm) => {
    try {
        const query = `
            SELECT *
            FROM CAPTIN
            WHERE
                -- Convert to FLOAT and calculate distance using Haversine formula
                6371 * ACOS(
                    COS(RADIANS(@lat)) * COS(RADIANS(CAST(LATITUDE AS FLOAT))) *
                    COS(RADIANS(CAST(LONGITUDE AS FLOAT)) - RADIANS(@lng)) +
                    SIN(RADIANS(@lat)) * SIN(RADIANS(CAST(LATITUDE AS FLOAT)))
                ) <= @radius
                AND STATUS = 'Available';
        `;

        const request = new sql.Request();
        request.input('lat', sql.Float, lat);
        request.input('lng', sql.Float, lng);
        request.input('radius', sql.Float, radiusKm);

        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL Server query error:', err);
        throw err;
    }
};
// module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

//     // radius in km


//     const captains = await captainModel.find({
//         location: {
//             $geoWithin: {
//                 $centerSphere: [ [ ltd, lng ], radius / 6371 ]
//             }
//         }
//     });

//     return captains;


// }