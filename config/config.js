module.exports = {
    server: {
            host: 'localhost',
            port: 3000
    },
    secret:{
      auth : 'RESTFULAPIs',
      session: '',
      tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'jwt_test',
        url: 'mongodb://127.0.0.1:27017/jwt_test'
    }
};
