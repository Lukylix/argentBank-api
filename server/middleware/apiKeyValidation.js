module.exports.validateApiKey = (req, res, next) => {
  let response = {};

  try {
    if (!req.headers.authorization) throw new Error("Api key is missing from header");

    const apiKey = req.headers.authorization;
    if (apiKey !== (process.env.API_KEY || "default-secret-key")) throw new Error("Api key is invalid");

    return next();
  } catch (error) {
    console.error("Error in apiKeyValidation.js", error);
    response.status = 401;
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};
