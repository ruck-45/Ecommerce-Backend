const pool = require("../connect");
const { checkDatabase, createUsersTable, insertUserDetails } = require("../constants/queries");

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

const insertUser = async (details) => {
  const res = await executeQuery(insertUserDetails, details);

  console.log(
    `User Creation ${res.success ? "Successful" : "Unsuccessful"}. Result : ${JSON.stringify(res.result[0])}`
  );
  return res.success;
};

module.exports = {
  executeQuery,
  testConnection,
  createAuthTable,
  insertUser,
};
