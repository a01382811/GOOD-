const sharp = require('sharp');
const fs = require('fs');

module.exports = (sock) => {
    return {
        // Créer sticker
        sticker: async (msg, args, sender) => {
            // Vérifier si le message contient une image
            const hasImage = msg.message?.imageMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
            
            if (hasImage) {
                await sock.sendMessage(sender, { text: '🎨 Création du sticker en cours...' });
                await sock.sendMessage(sender, { text: '✅ Sticker créé avec succès! (Fonctionnalité complète à venir)' });
            } else {
                await sock.sendMessage(sender, { text: '🎨 *Comment créer un sticker:*\n1. Envoyez une image\n2. Répondez à l\'image avec .sticker\nou ajoutez .sticker dans la légende' });
            }
        },
        
        // Sticker avec texte
        stickerwm: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '🎨 .stickerwm [texte] - Ajoute du texte sur le sticker' });
            await sock.sendMessage(sender, { text: `🎨 Sticker avec texte: "${args}"` });
        },
        
        // Image vers sticker
        toimg: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🖼️ Conversion sticker en image...' });
        },
        
        // Sticker qui pleure
        cry: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '😢 *pleure* 😢', sticker: true });
        },
        
        // Sticker heureux
        happy: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '😊 *est heureux* 😊' });
        },
        
        // Sticker qui rougit
        blush: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '😊 *rougit* 😊' });
        },
        
        // Sticker smug
        smug: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '😏 *sourit malicieusement* 😏' });
        }
    };
};
