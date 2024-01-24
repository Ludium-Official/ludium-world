const config = {
  experimental: {
    serverActions: true,
  },
  api: {
    bodyParse: {
      sizeLimit: "30mb",
    },
  },
};

module.exports = config;
