const jwt = require("jsonwebtoken");
const sql = require('mssql/msnodesqlv8');

async function isLoggedInCaptin(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }
    try {
        // Check if token is blacklisted
        let isBlackListed = await sql.query`SELECT * FROM BLACKLIST_TOKENS WHERE token = ${token}`;
        if (!isBlackListed.recordset || isBlackListed.recordset.length === 0) {
            // Token is not blacklisted
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // Fetch captin from CAPTIN table
            const captin = await sql.query`SELECT * FROM CAPTIN WHERE CAPTIN_ID = ${decoded.CAPTIN_ID}`;
            if (!captin.recordset || captin.recordset.length === 0) {
                return res.status(401).json({ message: 'Captin not found' });
            }
            captin.recordset[0].PASSWORD = undefined; // Exclude password from response
            captin.recordset[0].EMAIL = undefined; // Include token in response if needed
            req.captin = captin.recordset[0];
            //console.log("req.captin from isLoggedInCaptin: ", req.captin);
            return next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = isLoggedInCaptin;