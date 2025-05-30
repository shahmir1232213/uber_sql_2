const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'DESKTOP-O1B1J65',
    database: 'UBER_DB',
    driver: 'msnodesqlv8',
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-O1B1J65;Database=UBER_DB;Trusted_Connection=yes;',
    options: {
        trustedConnection: true
    }
};

async function connectToSQLServer() {
    try {
        await sql.connect(config);
        console.log(`Connected to SQL Server with database ${config.database}`);
    } catch (err) {
        console.error("Error connecting to SQL Server:", err);
    }
}

module.exports = connectToSQLServer();
