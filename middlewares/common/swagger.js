const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce (Web API project)",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/ecom/*.js"],
};
module.exports = options;
