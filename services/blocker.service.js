const fs = require('fs');
const path = require('path');
const config = require('../config');

// Ensure directory and file exist
function ensureStorageExists() {
    const dir = path.dirname(config.DATA_IP_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(config.DATA_IP_FILE)) {
        fs.writeFileSync(config.DATA_IP_FILE, '', 'utf-8');
    }
}

class BlockerService {
    constructor() {
        ensureStorageExists();
    }

    getBlockedIps() {
        try {
            ensureStorageExists();
            const content = fs.readFileSync(config.DATA_IP_FILE, 'utf-8');
            return content
                .split(/\r?\n/)
                .map(ip => ip.trim())
                .filter(ip => ip.length > 0);
        } catch (err) {
            console.error('Error reading blocked IP list:', err.message);
            return [];
        }
    }

    isIpBlocked(ip) {
        if (!ip) return false;
        const normalizedIp = ip.replace(/^.*:/, '').trim(); // normalize ipv4/ipv6 prefix
        const blockedIps = this.getBlockedIps();
        return blockedIps.some(blocked => blocked === ip || blocked === normalizedIp);
    }

    blockIp(ip) {
        if (!ip) return false;
        const cleanIp = ip.trim();
        if (!this.isIpBlocked(cleanIp)) {
            try {
                fs.appendFileSync(config.DATA_IP_FILE, `${cleanIp}\n`, 'utf-8');
                return true;
            } catch (err) {
                console.error('Error blocking IP:', err.message);
                return false;
            }
        }
        return false;
    }

    unblockIp(ip) {
        if (!ip) return false;
        const cleanIp = ip.trim();
        try {
            const list = this.getBlockedIps();
            const filtered = list.filter(item => item !== cleanIp);
            fs.writeFileSync(config.DATA_IP_FILE, filtered.join('\n') + (filtered.length ? '\n' : ''), 'utf-8');
            return true;
        } catch (err) {
            console.error('Error unblocking IP:', err.message);
            return false;
        }
    }
}

module.exports = new BlockerService();
