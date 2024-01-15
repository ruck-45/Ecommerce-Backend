const checkDatabaseQuery = `SHOW TABLES`;

const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(30) PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password_salt VARCHAR(64) NOT NULL,
        password_hash VARCHAR(128) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

const insertUserDetailsQuery = `
  INSERT INTO users (user_id, username, password_salt, password_hash, email)
  VALUES (?, ?, ?, ?, ?)
`;

const findUserEmailQuery = `SELECT * FROM users WHERE email = ?`;

const findUserIdQuery = `SELECT * FROM users WHERE user_id = ?`;

const createEmployeesTableQuery = `
      CREATE TABLE IF NOT EXISTS employees (
        user_id VARCHAR(30) UNIQUE PRIMARY KEY,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `;

const checkEmployeeQuery = `SELECT * FROM employees WHERE user_id = ?`;

module.exports = {
  checkDatabaseQuery,
  createUsersTableQuery,
  insertUserDetailsQuery,
  findUserEmailQuery,
  findUserIdQuery,
  createEmployeesTableQuery,
  checkEmployeeQuery,
};
