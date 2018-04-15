module.exports = {  
    // Database connection information
    //'database': 'mongodb://localhost/pacificboatclub',
    'database': 'mongodb://isco:123@ds125479.mlab.com:25479/pacificboatclub',

    // Setting port for server
    'port': process.env.PORT || 3000,  

    // Secret key for JWT signing and encryption
    'secret': 'super secret passphrase',
};