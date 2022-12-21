const axios = require("axios");
const { setTimeoutWithReturn } = require("../utilis/setTimeoutWithReturn");

const transactions = [
  {
    name: "Netflix",
    category: "Entertainment",
    type: "Electronic",
  },
  {
    name: "Amazon",
    category: "Shopping",
    type: "Electronic",
  },
  {
    name: "Uber",
    category: "Transportation",
    type: "Electronic",
  },
  {
    name: "McDonalds",
    category: "Food",
    type: "Electronic",
  },
  {
    name: "Starbucks",
    category: "Food",
    type: "Electronic",
  },
  {
    name: "Subway",
    category: "Food",
    type: "Electronic",
  },
  {
    name: "Ebay",
    category: "Shopping",
    type: "Electronic",
  },
  {
    name: "Electricity",
    category: "Housing",
    type: "Electronic",
  },
  {
    name: "Internet",
    category: "Housing",
    type: "Electronic",
  },
  {
    name: "Gas",
    category: "Housing",
    type: "Electronic",
  },
  {
    name: "Rent",
    category: "Housing",
    type: "Cheque",
  },
  {
    name: "Water",
    category: "Housing",
    type: "Cheque",
  },
  {
    name: "Electricity",
    category: "Housing",
    type: "Cheque",
  },
  {
    name: "Internet",
    category: "Housing",
    type: "Cheque",
  },
  {
    name: "Steam",
    category: "Entertainment",
    type: "Electronic",
  },
  {
    name: "Subway",
    category: "Transportation",
    type: "Electronic",
  },
  {
    name: "Airbnb",
    category: "Travel",
    type: "Electronic",
  },
  {
    name: "Tabacco",
    category: "Other",
    type: "Electronic",
  },
  {
    name: "ATM",
    category: "Other",
    type: "Cash",
  },
  {
    name: "University",
    category: "Education",
    type: "Electronic",
  },
];

const random = (min, max) => Math.random() * (max - min + 1) + min;

const baseURL = process.env.API_BASEURL || "http://localhost:3000";

module.exports.populateTransactions = async (usersWithAccounts, categories) => {
  let createdTransactions = [];
  usersWithAccounts.forEach((user) => {
    user.accounts.forEach(async (account) => {
      await axios
        .post(
          `${baseURL}/api/v1/user/accounts/${account.id}/transactions`,
          {
            userId: user.id,
            description: "Initial deposit",
            categoryId: categories.find((category) => category.name === "Other").id,
            type: "Cheque",
            amount: random(10000, 40000),
          },
          { headers: { authorization: process.env.API_KEY || "default-secret-key" } }
        )
        .then((res) => {
          console.log(`Created initial transaction`);
        })
        .catch((error) => {
          throw new Error(error?.response?.data?.message || error);
        });

      const numberToGenerate = Math.floor(random(200, 600));
      createdTransactions.push({ accountID: account.id, numberToGenerate, created: 0 });
      for (let i = 0; i < numberToGenerate; i++) {
        const transaction = transactions[Math.floor(random(0, transactions.length - 1))];
        const isRefound = Math.random() <= 0.05;
        await axios
          .post(
            `${baseURL}/api/v1/user/accounts/${account.id}/transactions`,
            {
              userId: user.id,
              description: transaction.name + (isRefound ? " Refound" : ""),
              categoryId: categories.find((category) => category.name === transaction.category).id,
              type: transaction.type,
              amount: isRefound ? random(5, 50) : random(5, 50) * -1,
            },
            { headers: { authorization: process.env.API_KEY || "default-secret-key" } }
          )
          .then((res) => {
            const transactionIndex = createdTransactions.findIndex(
              (transaction) => transaction.accountID === account.id
            );
            createdTransactions[transactionIndex].created++;
            console.log(`Created transaction ${transaction.name} ${isRefound ? "Refound" : ""}`);
          })
          .catch((error) => {
            throw new Error(error?.response?.data?.message || error);
          });
      }
    });
  });
  const waitForTrnasactions = async () => {
    let allTransactionsPopulated = true;
    if (createdTransactions.length === 0) return setTimeoutWithReturn(waitForTrnasactions);
    createdTransactions.forEach((transaction) => {
      if (transaction.created < transaction.numberToGenerate) {
        allTransactionsPopulated = false;
      }
    });
    if (allTransactionsPopulated) return createdTransactions.reduce((acc, cur) => acc + cur.created, 0);
    return setTimeoutWithReturn(waitForTrnasactions);
  };

  return waitForTrnasactions();
};
