const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secret } = config;

module.exports.comparePassword = async(password, userStored) => {
    const res = await bcrypt.compare(password, userStored.password);
    if (res) {
        // console.error(password,userStored.password,'holaa')
        const token = jwt.sign({ uid: userStored._id }, secret);
        return token;
    }
    return res;
};
module.exports.uidOrEmail = (param) => {
    let obj = new Object();
    if (param.indexOf('@') < 0) {
        obj._id = param;
    } else {
        obj.email = param;
    }
    return obj
}