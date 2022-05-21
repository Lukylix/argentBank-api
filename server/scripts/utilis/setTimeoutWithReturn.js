module.exports.setTimeoutWithReturn = async (func, timeout = 10) => {
  return await new Promise(async (resolve, reject) => {
    setTimeout(() => {
      resolve(func());
    }, timeout);
  });
};
