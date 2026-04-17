const axios = require('axios');

module.exports = (sock) => {
    return {
        // Waifu aléatoire
        waifu: async (msg, args, sender) => {
            try {
                const response = await axios.get('https://api.waifu.pics/sfw/waifu');
                if (response.data && response.data.url) {
                    await sock.sendMessage(sender, { image: { url: response.data.url }, caption: '🌸 Voici votre waifu !' });
                }
            } catch(e) {
                await sock.sendMessage(sender, { text: '🌸 Waifu - Désolé, API indisponible' });
            }
        },
        
        // Waifu aléatoire (version 2)
        rwaifu: async (msg, args, sender) => {
            try {
                const response = await axios.get('https://api.waifu.pics/sfw/waifu');
                await sock.sendMessage(sender, { image: { url: response.data.url }, caption: '🌸 Random Waifu' });
            } catch(e) {
                await sock.sendMessage(sender, { text: '🌸 Commande rwaifu' });
            }
        },
        
        // Anime kill
        animekill: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '⚔️ *Tu as été éliminé !* ⚔️' });
        },
        
        // Anime lick
        animelick: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '👅 *lèche*' });
        },
        
        // Anime bite
        animebite: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🦷 *mord*' });
        },
        
        // Anime happy
        animehappy: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '😊 *est heureux*' });
        },
        
        // Anime dance
        animatedance: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '💃 *danse*' });
        },
        
        // Anime search
        animesearch: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '🔍 .animesearch [nom anime]' });
            
            try {
                const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(args)}&limit=1`);
                if (response.data && response.data.data && response.data.data[0]) {
                    const anime = response.data.data[0];
                    await sock.sendMessage(sender, {
                        text: `📺 *${anime.title}*\n\n📝 Synopsis: ${anime.synopsis?.substring(0, 200) || 'Non disponible'}...\n⭐ Score: ${anime.score || 'N/A'}\n📅 Année: ${anime.year || 'N/A'}\n🔗 Plus: ${anime.url}`
                    });
                }
            } catch(e) {
                await sock.sendMessage(sender, { text: '❌ Anime non trouvé' });
            }
        },
        
        // Avatar anime
        animeavatar: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🖼️ Avatar anime généré' });
        }
    };
};
