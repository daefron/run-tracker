const db = require("../db/pool");
const authData = require("../hidden/authData");

async function getLastAuth() {
  const lastAuth = await db.query("SELECT * FROM auth WHERE owner = $1", [
    authData().owner,
  ]);
  return lastAuth.rows[0];
}

module.exports = {
  getLastAuth,
};
