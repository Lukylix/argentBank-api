const axios = require("axios");
const dotEnv = require("dotenv");
const { populateClients } = require("./services/populateClients");
const { populateCategories } = require("./services/populateCategories");
const { populateAccounts } = require("./services/populateAccounts");
dotEnv.config();

const client = axios.create({
  baseURL: "http://localhost:3001/api/v1",
});

const main = async () => {
  try {
    // Check if populated
    const response = await client.get("/categories");
    if (response.data.body.length > 0) {
      console.log("Database already populated!");
      return;
    }

    const [users, categories] = await Promise.all([populateClients(), populateCategories()]);
    const usersWithAccounts = await populateAccounts(users);

    console.log("Database successfully populated!");
  } catch (error) {
    console.log(error);
  }
};
main();
