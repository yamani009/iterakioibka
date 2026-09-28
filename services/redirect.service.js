const fs = require('fs');
const path = require('path');
const config = require('../config');

const FILE = path.join(__dirname, '..', 'data', 'redirect_url.txt');

function ensureExists() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, config.REDIRECT_URL, 'utf-8');
    }
}

class RedirectService {
    getUrl() {
        try {
            ensureExists();
            const content = fs.readFileSync(FILE, 'utf-8').trim();
            return content || config.REDIRECT_URL;
        } catch (err) {
            console.error('Error reading redirect URL:', err.message);
            return config.REDIRECT_URL;
        }
    }

    setUrl(url) {
        const clean = String(url || '').trim();
        if (!clean) return false;
        try {
            fs.mkdirSync(path.dirname(FILE), { recursive: true });
            fs.writeFileSync(FILE, clean, 'utf-8');
            return true;
        } catch (err) {
            console.error('Error saving redirect URL:', err.message);
            return false;
        }
    }
}

module.exports = new RedirectService();