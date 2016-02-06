var AWS = {
        bucket: 'files.blokdust.com'
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
      port: 8080
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
