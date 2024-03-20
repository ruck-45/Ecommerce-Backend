// ********************************** Database Queries ***********************************************

const checkDatabaseQuery = `SHOW TABLES`;

// ********************************** Create Table Queries ***********************************************

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

const createEmployeesTableQuery = `
      CREATE TABLE IF NOT EXISTS employees (
        user_id VARCHAR(30) PRIMARY KEY,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `;

const createProfileTableQuery = `
      CREATE TABLE IF NOT EXISTS profile (
        user_id VARCHAR(30) PRIMARY KEY,
        address TEXT,
        phone VARCHAR(20),
        state TEXT,
        address_code TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `;

const createItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS items (
      item_id VARCHAR(30) PRIMARY KEY,
      imageCount INT,
      brand TEXT,
      title TEXT,
      color TEXT,
      discountedPrice FLOAT,
      price FLOAT,
      discountPercent FLOAT,
      highlights JSON,
      details TEXT,
      quantity INT,
      material TEXT,
      dimension VARCHAR(40),
      description TEXT,
      topLevelCategory TEXT,
      secondLevelCategory TEXT,
      thirdLevelCategory TEXT,
      orders INT,
      minimumOrder INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

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

const createBlogContentTableQuery = `
    CREATE TABLE IF NOT EXISTS blog_content (
      blog_id varchar(40) PRIMARY KEY,
      content JSON,
      FOREIGN KEY (blog_id) REFERENCES blogs(blog_id)
    );
  `;

const createItemQuery = `
    INSERT INTO items (
      item_id,
      imageCount,
      brand,
      title,
      color,
      discountedPrice,
      price,
      discountPercent,
      highlights,
      details,
      quantity,
      material,
      dimension,
      description,
      topLevelCategory,
      secondLevelCategory,
      thirdLevelCategory,
      orders,
      minimumOrder
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

// ********************************** Initialize / Update Table Queries ***********************************************

const initializeUserProfile = `
  INSERT INTO profile (user_id, address, phone, state, address_code)
  VALUES (?, "", "", "", "")
`;

const insertUserDetailsQuery = `
  INSERT INTO users (user_id, username, password_salt, password_hash, email)
  VALUES (?, ?, ?, ?, ?)
`;

const updateProfileInfo = `
    UPDATE profile
    SET
      address = ?,
      phone = ?,
      state = ?,
      address_code = ?
    WHERE user_id = ?
  `;

const initializeBlog = `
  INSERT INTO blogs (blog_id, title, summary, image, user_id, created_at)
  VALUES (?, ?, ?, ?, ?, NOW())
`;

const initializeBlogContent = `
  INSERT INTO blog_content (blog_id, content)
  VALUES (?, ?)
  `;

const changePassword = `UPDATE users SET password_salt = ?,password_hash=? WHERE user_id = ?`;

const updateItemQuery = `
  UPDATE items 
  SET 
    brand = ?,
    title = ?,
    color = ?,
    discountedPrice = ?,
    price = ?,
    discountPercent = ?,
    highlights = ?,
    details = ?,
    quantity = ?,
    material = ?,
    dimension = ?,
    description = ?,
    topLevelCategory = ?,
    secondLevelCategory = ?,
    thirdLevelCategory = ?,
    orders = ?,
    minimumOrder = ?,
    imageCount = ?
  WHERE 
    item_id = ?
`;

// ********************************** Find / View Queries ***********************************************

const findUserEmailQuery = `SELECT * FROM users WHERE email = ?`;

const findUserIdQuery = `SELECT * FROM users WHERE user_id = ?`;

const checkEmployeeQuery = `SELECT * FROM employees WHERE user_id = ?`;

const getUserProfile = `SELECT * FROM profile WHERE user_id = ?`;

const getTotalBlogsQuery = `SELECT COUNT(*) AS totalBlogs FROM blogs`;

const getBlogsQuery = `SELECT blog_id, title, summary, image, created_at FROM blogs ORDER BY created_at DESC LIMIT ? OFFSET ?`;

const getItemsQuery = `SELECT item_id, imageUrl, brand, title, color, discountedPrice, price  FROM items LIMIT ? OFFSET ?`;

const getBlogByIdQuery = `SELECT content FROM blog_content WHERE blog_id = ?`;

const getItemByIdQuery = `SELECT * FROM items WHERE item_id = ?`;

const getTotalItemsQuery = `SELECT COUNT(*) AS totalItems FROM items`;

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
  changePassword,
  createItemsTableQuery,
  getTotalItemsQuery,
  getItemsQuery,
  getItemByIdQuery,
  createItemQuery,
  updateItemQuery,
};
