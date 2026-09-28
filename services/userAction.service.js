// Per-user (per-IP) redirect actions set from the admin dashboard.
// When an admin picks a destination page for a specific visitor, that IP is
// stored with a pending redirect target. On the visitor's next request to a
// non-admin route, the middleware sends them to the chosen page once.
class UserActionService {
    constructor() {
        this.pending = new Map(); // ip -> target path
    }

    schedule(ip, target) {
        if (!ip || !target) return false;
        this.pending.set(ip, target);
        return true;
    }

    // Return and clear the pending target for an IP (one-shot redirect).
    consume(ip) {
        const target = this.pending.get(ip);
        this.pending.delete(ip);
        return target || null;
    }

    has(ip) {
        return this.pending.has(ip);
    }

    clearAll() {
        this.pending.clear();
    }
}

module.exports = new UserActionService();