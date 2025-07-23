// config.js
require('dotenv').config();

const apiKey = process.env.GITHUB_TOKEN;

console.log("Your API Key is: ", apiKey);
