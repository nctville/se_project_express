require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "prod-secret";

module.exports = { JWT_SECRET };