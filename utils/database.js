const pool = require("../connect");
const { checkDatabase, createUsersTable } = require("../constants/queries");

const executeQuery = async (query) => {
  const res = {};
  try {
    const result = await pool.query(query);
    res.result = result;
    res.success = true;
  } catch (err) {
    res.result = err;
    res.success = false;
  }

  return res;
};

const testConnection = async () => {
  const res = await executeQuery(checkDatabase);
  if (res.success) {
    console.log(`Database Connection Successful. Test Result : ${res.result[0]}`);
  } else {
    throw Error(res.result);
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
