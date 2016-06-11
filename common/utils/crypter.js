const crypto = require('crypto'),
    len = 16;

const genRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0,length);
};

const hash = (password, salt) => {
    return crypto.createHmac('sha512', salt)
        .update(password)
        .digest('hex');
};

const salt = () => {
    return genRandomString(len);
};

const md5 = (text) => {
    return crypto.createHash('md5')
        .update(text)
        .digest('hex');
};

const compare = (pasw, pasw2, salt) => {
    return hash(pasw, salt) === hash(pasw2, salt);
};

module.exports = {
    hash: hash,
    salt: salt,
    md5: md5,
    compare: compare
};