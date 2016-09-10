var AWS = {
        bucket: 'files.blokdust.io'
    };

var config = {
  development: {
    AWS: AWS,
    server: {
      port: 3000
    }
  },
  testing: {
    AWS: AWS,
    server: {
      port: 3001
    }
  },
  production: {
    AWS: AWS,
    server: {
      port: 9000
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
