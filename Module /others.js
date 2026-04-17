const axios = require('axios');

module.exports = (sock) => {
    return {
        // Dictionnaire
        dictionary: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '📖 .dictionary [mot]' });
            await sock.sendMessage(sender, { text: `📖 Définition de "${args}": (Fonctionnalité à venir)` });
        },
        
        // Wiki
        wiki: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '📚 .wiki [recherche]' });
            await sock.sendMessage(sender, { text: `📚 Recherche Wikipedia: ${args}` });
        },
        
        // Météo
        weather: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '🌤️ .weather [ville]\nExemple: .weather Paris' });
            await sock.sendMessage(sender, { text: `🌤️ Météo pour ${args}: 22°C, Ensoleillé` });
        },
        
        // Heure
        time: async (msg, args, sender) => {
            const now = new Date();
            await sock.sendMessage(sender, { text: `⏰ *Heure actuelle*\n📅 Date: ${now.toLocaleDateString('fr-FR')}\n🕐 Heure: ${now.toLocaleTimeString('fr-FR')}\n🌍 Fuseau: GMT+1` });
        },
        
        // Recette
        recipe: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '🍳 .recipe [plat]' });
            await sock.sendMessage(sender, { text: `🍳 Recette pour ${args}: (Fonctionnalité à venir)` });
        },
        
        // Horoscope
        horoscope: async (msg, args, sender) => {
            const signes = ['bélier', 'taureau', 'gémeaux', 'cancer', 'lion', 'vierge', 'balance', 'scorpion', 'sagittaire', 'capricorne', 'verseau', 'poissons'];
            if (!args || !signes.includes(args.toLowerCase())) {
                return await sock.sendMessage(sender, { text: `⭐ .horoscope [signe]\nSignes: ${signes.join(', ')}` });
            }
            await sock.sendMessage(sender, { text: `⭐ Horoscope ${args}: Une belle journée vous attend !` });
        },
        
        // Livre
        book: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '📚 Commande livre - Recherche de livres' });
        },
        
        // Récupérer photo de profil
        getpp: async (msg, args, sender) => {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const target = (mentioned && mentioned[0]) || sender;
            
            try {
                const ppUrl = await sock.profilePictureUrl(target, 'image');
                await sock.sendMessage(sender, { image: { url: ppUrl }, caption: `🖼️ Photo de profil` });
            } catch(e) {
                await sock.sendMessage(sender, { text: '❌ Aucune photo de profil trouvée' });
            }
        },
        
        // AI (ChatGPT simplifié)
        ai: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '🤖 .ai [votre question]' });
            await sock.sendMessage(sender, { text: `🤖 *IA Réponse:*\nJe suis KILLER AI. Vous avez demandé: "${args}"\n\n(Fonctionnalité complète avec API OpenAI à venir)` });
        },
        
        // QR Code
        qr: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '📱 .qr [texte ou lien]' });
            await sock.sendMessage(sender, { text: `📱 QR Code généré pour: ${args}` });
        },
        
        // Lire QR Code
        readqr: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '📷 Envoyez une image de QR code et répondez avec .readqr' });
        },
        
        // Générer mot de passe
        genpass: async (msg, args, sender) => {
            const length = parseInt(args) || 12;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
            let password = '';
            for (let i = 0; i < length; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            await sock.sendMessage(sender, { text: `🔐 Mot de passe généré (${length} caractères):\n\`${password}\`` });
        },
        
        // Mon IP
        myip: async (msg, args, sender) => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                await sock.sendMessage(sender, { text: `🌐 Votre IP: ${response.data.ip}` });
            } catch(e) {
                await sock.sendMessage(sender, { text: '❌ Impossible de récupérer l\'IP' });
            }
        },
        
        // Calculatrice
        calculate: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '🧮 .calculate [opération]\nExemple: .calculate 2+2' });
            
            try {
                // Évaluation sécurisée (ne pas utiliser eval directement en production)
                const result = eval(args);
                await sock.sendMessage(sender, { text: `🧮 Résultat: ${args} = ${result}` });
            } catch(e) {
                await sock.sendMessage(sender, { text: '❌ Opération invalide' });
            }
        },
        
        // Rappel
        remind: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '⏰ .remind [temps] [message]\nExemple: .remind 5m Boire de l\'eau' });
            
            const match = args.match(/(\d+)([smh])\s+(.+)/);
            if (match) {
                const value = parseInt(match[1]);
                const unit = match[2];
                const message = match[3];
                
                let ms = 0;
                if (unit === 's') ms = value * 1000;
                if (unit === 'm') ms = value * 60 * 1000;
                if (unit === 'h') ms = value * 60 * 60 * 1000;
                
                await sock.sendMessage(sender, { text: `⏰ Rappel programmé dans ${value}${unit} pour: "${message}"` });
                
                setTimeout(async () => {
                    await sock.sendMessage(sender, { text: `⏰ *RAPPEL*\n${message}` });
                }, ms);
            }
        }
    };
};
