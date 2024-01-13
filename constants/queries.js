const checkDatabase = `SHOW TABLES`;

const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(30) UNIQUE PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password_salt VARCHAR(64) NOT NULL,
        password_hash VARCHAR(128) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

const insertUserDetails = `
  INSERT INTO users (user_id, username, password_salt, password_hash, email)
  VALUES (?, ?, ?, ?, ?)
`;

const findUserEmail = `SELECT * FROM users WHERE email = ?`;

module.exports = {
  checkDatabase,
  createUsersTable,
  insertUserDetails,
  findUserEmail,
};
