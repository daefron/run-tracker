const db = require("../db/pool");

async function getLastAuth() {
  const lastAuth = await db.query(
    'SELECT * FROM "auth" WHERE "id" = (SELECT max("id") FROM "auth")'
  );
  return lastAuth.rows[0];
}

module.exports = {
  getLastAuth,
};
