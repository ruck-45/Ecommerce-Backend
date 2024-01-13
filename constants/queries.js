const checkDatabase = `SHOW TABLES`;
const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(14) PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;



module.exports = {
  checkDatabase,
  createUsersTable,
};
