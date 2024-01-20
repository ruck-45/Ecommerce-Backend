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
        user_id VARCHAR(30) PRIMARY KEY,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `;

const checkEmployeeQuery = `SELECT * FROM employees WHERE user_id = ?`;

const createProfileTableQuery = `
      CREATE TABLE IF NOT EXISTS profile (
        user_id VARCHAR(30) PRIMARY KEY,
        about TEXT,
        profession VARCHAR(255),
        address TEXT,
        phone VARCHAR(20),
        plan VARCHAR(10),
        image VARCHAR(50) UNIQUE,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `;

const initializeUserProfile = `
  INSERT INTO profile (user_id, about, profession, address, phone, plan, image)
  VALUES (?, "", "", "", "", "", ?)
`;

const getUserProfile = `SELECT * FROM profile WHERE user_id = ?`;

const updateProfileInfo = `
    UPDATE profile
    SET
      about = ?,
      profession = ?,
      address = ?,
      phone = ?
    WHERE user_id = ?
  `;

const getImageId = `SELECT image FROM profile WHERE user_id = ?`;

const createBlogTableQuery = `
    CREATE TABLE IF NOT EXISTS blogs (
      blog_id varchar(40) PRIMARY KEY ,
      title VARCHAR(260) NOT NULL,
      description TEXT,
      employee_id VARCHAR(30) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(user_id)
    );
  `;

const getBlogByIdQuery = `SELECT * FROM blogs WHERE blog_id = ?`;

const getBlogsQuery = `SELECT * FROM blogs ORDER BY created_at DESC LIMIT 15;`;

const initializeBlog = `
  INSERT INTO blogs (blog_id, title, description, employee_id, created_at)
  VALUES (?, ?, ?, ?, NOW())
`;


const createBlogsUnitTableQuery = `
    CREATE TABLE IF NOT EXISTS blogs_unit (
      blog_unit_id varchar(40) PRIMARY KEY ,
      title VARCHAR(260) NOT NULL,
      description TEXT,
      employee_id VARCHAR(30) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(user_id)
    );
  `;

module.exports = {
  checkDatabaseQuery,
  createUsersTableQuery,
  insertUserDetailsQuery,
  findUserEmailQuery,
  findUserIdQuery,
  createEmployeesTableQuery,
  checkEmployeeQuery,
  createProfileTableQuery,
  initializeUserProfile,
  getUserProfile,
  updateProfileInfo,
};
