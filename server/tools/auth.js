const db = require("../db/pool");

async function getLastAuth() {
  const lastAuth = await db.query("SELECT * FROM auth WHERE owner = $1", [
    process.env.owner,
  ]);
  return lastAuth.rows[0];
}

module.exports = {
  getLastAuth,
};
