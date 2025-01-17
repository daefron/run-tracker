const { Pool } = require("pg");

module.exports = new Pool({
  connectionString: "postgresql://tom:testpassword@localhost:5432/run_tracker",
});
