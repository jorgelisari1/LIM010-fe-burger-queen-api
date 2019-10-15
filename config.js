exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/test';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
<<<<<<< HEAD
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@testing.com';
exports.adminPassword = process.env.ADMIN_PASSWORD || '12345678';
=======
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';
>>>>>>> a48fafccf601733b8deb324dd37a1b7bacc01e48
