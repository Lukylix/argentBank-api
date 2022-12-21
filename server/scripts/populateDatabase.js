const axios = require("axios");
const dotEnv = require("dotenv");
const { populateClients } = require("./services/populateClients");
const { populateCategories } = require("./services/populateCategories");
const { populateAccounts } = require("./services/populateAccounts");
const { populateTransactions } = require("./services/populateTransactions");
dotEnv.config();

const baseURL = process.env.API_BASEURL || "http://localhost:3000";

const client = axios.create({
  baseURL: `${baseURL}/api/v1`,
});

axios.interceptors.response.use(undefined, (err) => {
  const { config, message } = err;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }
  // retry while Network timeout or Network Error
  if (!(message.includes("timeout") || message.includes("Network Error"))) {
    return Promise.reject(err);
  }
  config.retry -= 1;
  const delayRetryRequest = new Promise((resolve) => {
    setTimeout(() => {
      console.log("Retrying the request", config.url);
      resolve();
    }, config.retryDelay || 1000);
  });
  return delayRetryRequest.then(() => axios(config));
});

const main = async () => {
  try {
    // Check if populated retry for 25 seconds
    const response = await client.get("/categories", { retry: 5, retryDelay: 5000 });
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
