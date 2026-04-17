class AntiSpam {
    constructor() { this.users = new Map(); }
    isSpam(userId) {
        const now = Date.now();
        const user = this.users.get(userId) || { count: 0, firstMsg: now, mutedUntil: 0 };
        if (user.mutedUntil > now) return true;
        if (now - user.firstMsg > 5000) { user.count = 1; user.firstMsg = now; }
        else { user.count++; }
        if (user.count >= 5) { user.mutedUntil = now + 300000; this.users.set(userId, user); return true; }
        this.users.set(userId, user); return false;
    }
}
module.exports = new AntiSpam();
