module.exports = {  
    // Database connection information
    'database': 'mongodb://localhost/pacificboatclub',

    // Setting port for server
    'port': process.env.PORT || 3000,  

    // Secret key for JWT signing and encryption
    'secret': 'super secret passphrase',
};