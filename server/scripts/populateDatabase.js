const axios = require("axios");
const dotEnv = require("dotenv");
const { populateClients } = require("./services/populateClients");
const { populateCategories } = require("./services/populateCategories");
const { populateAccounts } = require("./services/populateAccounts");
const { populateTransactions } = require("./services/populateTransactions");
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

    const numberTransactions = await populateTransactions(usersWithAccounts, categories);
    console.log(`Created ${numberTransactions} transactions`);
    console.log("Database populated!");
  } catch (error) {
    console.log(error);
  }
};
main();
