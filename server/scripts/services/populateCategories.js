const axios = require("axios");
const { setTimeoutWithReturn } = require("../utilis/setTimeoutWithReturn");

const categories = [
  "Food",
  "Bills",
  "Entertainment",
  "Shopping",
  "Transportation",
  "Housing",
  "Travel",
  "Health",
  "Gifts",
  "Education",
  "Utilities",
  "Debt",
  "Investment",
  "Savings",
  "Other",
];

module.exports.populateCategories = async () => {
  const createdCategories = [];
  categories.forEach((category) => {
    axios
      .post(
        "http://localhost:3001/api/v1/categories",
        { name: category },
        { headers: { authorization: process.env.API_KEY } }
      )
      .then((res) => {
        createdCategories.push(res.data.body);
        console.log(`Created category ${category}`);
      })
      .catch((error) => {
        throw new Error(error?.response?.data?.message || error);
      });
  });

  const waitForCategories = async () => {
    if (createdCategories.length === categories.length) return createdCategories;
    return setTimeoutWithReturn(waitForCategories);
  };

  return waitForCategories();
};
