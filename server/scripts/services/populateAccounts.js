const axios = require("axios");
const { setTimeoutWithReturn } = require("../utilis/setTimeoutWithReturn");

const bankAccountTypes = ["Checking", "Savings", "Credit Card"];

module.exports.populateAccounts = async (users) => {
  users.forEach((user) => {
    user.accounts = [];
    bankAccountTypes.forEach((accountType) => {
      axios
        .post(
          "http://localhost:3001/api/v1/user/accounts",
          {
            userId: user.id,
            type: accountType,
          },
          {
            headers: {
              authorization: process.env.API_KEY,
            },
          }
        )
        .then((res) => {
          user.accounts.push(res.data.body);
          console.log(`Created bank account ${accountType} for user ${user.email}`);
        })
        .catch((error) => {
          throw new Error(error?.response?.data?.message || error);
        });
    });
  });

  const waitForAccounts = async () => {
    let allUsersGotAccounts = true;
    users.forEach((user) => {
      if (user.accounts.length !== bankAccountTypes.length) allUsersGotAccounts = false;
    });
    if (allUsersGotAccounts) return users;
    return setTimeoutWithReturn(waitForAccounts);
  };

  return waitForAccounts();
};
