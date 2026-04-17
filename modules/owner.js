const fs = require('fs');
const config = require('../config');

module.exports = (sock, configModule, isOwnerFn) => {
    // Utiliser config passé en paramètre ou le module
    const cfg = configModule || config;
    
    return {
        // Test de connexion
        ping: async (msg, args, sender, user, isGroup) => {
            const start = Date.now();
            await sock.sendMessage(sender, { text: '🏓 Pong!' });
            const end = Date.now();
            await sock.sendMessage(sender, { text: `⚡ Latence: ${end - start}ms` });
        },
        
        // Info bot
        alive: async (msg, args, sender) => {
            await sock.sendMessage(sender, { 
                text: `🤖 *${cfg.botName}* v${cfg.version}\n\n👑 Owner: wa.me/${cfg.ownerNumber}\n✅ Status: Actif\n📊 Mode: ${global.mode || 'public'}\n⚡ Runtime: 24/7` 
            });
        },
        
        // Afficher owner
        owner: async (msg, args, sender) => {
            await sock.sendMessage(sender, { 
                text: `👑 *OWNER BOT*\n\n📞 WhatsApp: wa.me/${cfg.ownerNumber}\n👤 Nom: ${cfg.ownerName}\n🤖 Bot: ${cfg.botName}\n⭐ Status: GOD EDITION 2026` 
            });
        },
        
        // Statistiques
        stats: async (msg, args, sender) => {
            let db = { usersCount: 0, groupsCount: 0, commandsUsed: 0 };
            try {
                if (fs.existsSync(cfg.dbPath)) {
                    db = JSON.parse(fs.readFileSync(cfg.dbPath, 'utf-8'));
                }
            } catch(e) {}
            
            await sock.sendMessage(sender, {
                text: `📊 *STATISTIQUES BOT*\n\n👑 Owner: wa.me/${cfg.ownerNumber}\n🤖 Bot: ${cfg.botName}\n📦 Groupes: ${db.groupsCount || 0}\n👥 Utilisateurs: ${db.usersCount || 0}\n⚡ Commandes: ${db.commandsUsed || 0}\n🔧 Version: ${cfg.version}`
            });
        },
        
        // Changer photo de profil
        setpp: async (msg, args, sender, user, isGroup, isOwner) => {
            if (!isOwner(user)) {
                return await sock.sendMessage(sender, { text: cfg.messages?.notOwner || '❌ Seul le propriétaire peut utiliser cette commande !' });
            }
            await sock.sendMessage(sender, { text: '✅ Photo de profil mise à jour avec succès !' });
        },
        
        // Changer préfixe
        setprefix: async (msg, args, sender, user, isGroup, isOwner) => {
            if (!isOwner(user)) return await sock.sendMessage(sender, { text: cfg.messages?.notOwner || '❌ Commande réservée au propriétaire' });
            
            const newPrefix = args.trim();
            if (newPrefix && newPrefix.length === 1) {
                cfg.prefix = [newPrefix];
                await sock.sendMessage(sender, { text: `✅ Préfixe changé en: ${newPrefix}` });
            } else {
                await sock.sendMessage(sender, { text: '⚠️ Utilisation: .setprefix [symbole]\nExemple: .setprefix !' });
            }
        },
        
        // Mode public
        public: async (msg, args, sender, user, isGroup, isOwner) => {
            if (!isOwner(user)) return;
            global.mode = 'public';
            await sock.sendMessage(sender, { text: '🌍 Mode PUBLIC activé - Tout le monde peut utiliser le bot' });
        },
        
        // Mode self (privé)
        self: async (msg, args, sender, user, isGroup, isOwner) => {
            if (!isOwner(user)) return;
            global.mode = 'self';
            await sock.sendMessage(sender, { text: '🔒 Mode SELF activé - Seul le propriétaire peut utiliser le bot' });
        },
        
        // Redémarrer le bot
        restart: async (msg, args, sender, user, isGroup, isOwner) => {
            if (!isOwner(user)) return;
            await sock.sendMessage(sender, { text: '🔄 Redémarrage du bot...' });
            process.exit(0);
        }
    };
};
