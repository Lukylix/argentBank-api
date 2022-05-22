const axios = require("axios");
const { setTimeoutWithReturn } = require("../utilis/setTimeoutWithReturn");

const users = [
  {
    firstName: "Tony",
    lastName: "Stark",
    email: "tony@stark.com",
    password: "password123",
  },
  {
    firstName: "Steve",
    lastName: "Rogers",
    email: "steve@rogers.com",
    password: "password456",
  },
];

module.exports.populateClients = async () => {
  createdUsers = [];
  users.forEach((user) => {
    axios
      .post("http://localhost:3001/api/v1/user/signup", user)
      .then((res) => {
        createdUsers.push({ ...res.data.body, password: user.password });
        console.log(`Created user ${user.email}`);
      })
      .catch((error) => {
        throw new Error(error?.response?.data?.message || error);
      });
  });
  const waitForUsers = async () => {
    if (createdUsers.length === users.length) return createdUsers;
    return setTimeoutWithReturn(waitForUsers);
  };
  return waitForUsers();
};
