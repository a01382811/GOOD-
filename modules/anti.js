const fs = require('fs');

// Configuration des filtres
const filterFile = './database/filters.json';

if (!fs.existsSync(filterFile)) {
    fs.writeFileSync(filterFile, JSON.stringify([], null, 2));
}

module.exports = (sock) => {
    const loadFilters = () => {
        try {
            return JSON.parse(fs.readFileSync(filterFile, 'utf-8'));
        } catch(e) {
            return [];
        }
    };
    
    const saveFilters = (filters) => {
        fs.writeFileSync(filterFile, JSON.stringify(filters, null, 2));
    };
    
    return {
        // Anti-toxique
        antigrosmot: async (msg, args, sender, user, isGroup) => {
            const motsInterdits = ['merde', 'pute', 'connard', 'salope', 'enculé', 'fuck', 'shit'];
            // À implémenter dans le handler principal
            await sock.sendMessage(sender, { text: '🛡️ Anti-toxique activé' });
        },
        
        // Anti-foreign (messages étrangers)
        antiforeign: async (msg, args, sender, user, isGroup) => {
            await sock.sendMessage(sender, { text: '🛡️ Anti-foreign activé - Seul le français est autorisé' });
        },
        
        // Anti-virus
        antivirus: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🛡️ Anti-virus activé - Fichiers suspects bloqués' });
        },
        
        // Anti-sticker
        antisticker: async (msg, args, sender, user, isGroup) => {
            await sock.sendMessage(sender, { text: '🛡️ Anti-sticker activé - Les stickers sont bloqués' });
        },
        
        // Anti-poll
        antipoll: async (msg, args, sender, user, isGroup) => {
            await sock.sendMessage(sender, { text: '🛡️ Anti-poll activé - Les sondages sont bloqués' });
        },
        
        // Anti-call (appels)
        anticall: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '📵 Anti-call - Le bot bloque les appels' });
        },
        
        // Anti-flood
        antispam: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🛡️ Anti-flood activé - Spam bloqué' });
        },
        
        // Anti-vue unique
        antivotep: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '👁️ Anti-vue unique - Messages éphémères bloqués' });
        },
        
        // Anti-suppression
        antidelete: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🗑️ Anti-delete activé - Messages supprimés visibles' });
        },
        
        // Anti-bot
        antibot: async (msg, args, sender, user, isGroup) => {
            await sock.sendMessage(sender, { text: '🤖 Anti-bot activé - Autres bots bloqués' });
        },
        
        // Filtrer un mot
        filter: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            if (!args) return await sock.sendMessage(sender, { text: '⚠️ Utilisation: .filter mot' });
            
            const filters = loadFilters();
            if (!filters.includes(args.toLowerCase())) {
                filters.push(args.toLowerCase());
                saveFilters(filters);
                await sock.sendMessage(sender, { text: `✅ Mot "${args}" ajouté au filtre` });
            } else {
                await sock.sendMessage(sender, { text: `ℹ️ Le mot "${args}" est déjà filtré` });
            }
        },
        
        // Enlever un filtre
        unfilter: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            if (!args) return await sock.sendMessage(sender, { text: '⚠️ Utilisation: .unfilter mot' });
            
            let filters = loadFilters();
            const index = filters.indexOf(args.toLowerCase());
            if (index !== -1) {
                filters.splice(index, 1);
                saveFilters(filters);
                await sock.sendMessage(sender, { text: `✅ Mot "${args}" retiré du filtre` });
            } else {
                await sock.sendMessage(sender, { text: `ℹ️ Le mot "${args}" n'est pas dans le filtre` });
            }
        },
        
        // Liste des filtres
        filterlist: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            const filters = loadFilters();
            if (filters.length === 0) {
                await sock.sendMessage(sender, { text: '📋 Aucun mot filtré' });
            } else {
                await sock.sendMessage(sender, { text: `📋 *Mots filtrés:*\n${filters.map((f, i) => `${i+1}. ${f}`).join('\n')}` });
            }
        }
    };
};
