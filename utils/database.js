const pool = require("../config/databaseConfig");
const {
  checkDatabaseQuery,
  createUsersTableQuery,
  createEmployeesTableQuery,
  createProfileTableQuery,
  createBlogTableQuery
} = require("../constants/queries");

const executeQuery = async (query, values = []) => {
  let success;
  let result;

  try {
    result = await pool.query(query, values);
    success = true;
  } catch (err) {
    result = err;
    success = false;
  }

  return {
    result,
    success,
  };
};

const testConnection = async () => {
  const res = await executeQuery(checkDatabaseQuery);
  if (res.success) {
    console.log(`Database Connection Successful. Test Result : ${JSON.stringify(res.result[0])}`);
  } else {
    throw Error(JSON.stringify(res.result));
  }
};

const createUsersTable = async () => {
  const res = await executeQuery(createUsersTableQuery);
  if (res.success) {
    console.log(`Users Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
};

const createEmployeesTable = async () => {
  const res = await executeQuery(createEmployeesTableQuery);
  if (res.success) {
    console.log(`Employees Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
};

const createProfileTable = async () => {
  const res = await executeQuery(createProfileTableQuery);
  if (res.success) {
    console.log(`Profile Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
};

const createBlogTable = async () => {
  const res = await executeQuery(createBlogTableQuery);
  if (res.success) {
    console.log(`Blog Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
}

module.exports = {
  executeQuery,
  testConnection,
  createUsersTable,
  createEmployeesTable,
  createProfileTable,
  createBlogTable,
};
