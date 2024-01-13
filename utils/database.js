const pool = require("../config/databaseConfig");
const { checkDatabase, createUsersTable } = require("../constants/queries");

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
  const res = await executeQuery(checkDatabase);
  if (res.success) {
    console.log(`Database Connection Successful. Test Result : ${JSON.stringify(res.result[0])}`);
  } else {
    throw Error(JSON.stringify(res.result));
  }
};

const createAuthTable = async () => {
  const res = await executeQuery(createUsersTable);
  if (res.success) {
    console.log(`Users Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
};

module.exports = {
  executeQuery,
  testConnection,
  createAuthTable,
};
