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

const getTotalBlogsQuery = `SELECT COUNT(*) AS totalBlogs FROM blogs`;

const createBlogTableQuery = `
    CREATE TABLE IF NOT EXISTS blogs (
      blog_id varchar(40) PRIMARY KEY ,
      title VARCHAR(100) NOT NULL,
      summary VARCHAR(260) NOT NULL,
      image VARCHAR(50) UNIQUE,
      user_id VARCHAR(30) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
  `;

const getBlogsQuery = `SELECT blog_id, title, summary, image, created_at FROM blogs ORDER BY created_at DESC LIMIT ? OFFSET ?`;

const getBlogByIdQuery = `SELECT content FROM blog_content WHERE blog_id = ?`;

const initializeBlog = `
  INSERT INTO blogs (blog_id, title, summary, image, user_id, created_at)
  VALUES (?, ?, ?, ?, ?, NOW())
`;

const initializeBlogContent = `
  INSERT INTO blog_content (blog_id, content)
  VALUES (?, ?)
  `;

const createBlogContentTableQuery = `
    CREATE TABLE IF NOT EXISTS blog_content (
      blog_id varchar(40) PRIMARY KEY,
      content JSON,
      FOREIGN KEY (blog_id) REFERENCES blogs(blog_id)
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
  createBlogTableQuery,
  getBlogByIdQuery,
  getBlogsQuery,
  initializeBlog,
  createBlogContentTableQuery,
  getTotalBlogsQuery,
  initializeBlogContent,
};
