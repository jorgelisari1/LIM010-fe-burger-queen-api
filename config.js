exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/test';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
<<<<<<< HEAD
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
=======
exports.adminEmail = process.env.ADMIN_EMAIL || '';
>>>>>>> b12de21ffad85d7f30803f1cafca92e405396046
exports.adminPassword = process.env.ADMIN_PASSWORD || '';
