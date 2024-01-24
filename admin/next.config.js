const config = {
  experimental: {
    serverActions: true,
  },
  api: {
    bodyParse: {
      sizeLimit: "30mb",
      responseLimit: "30mb",
    },
  },
};

module.exports = config;
