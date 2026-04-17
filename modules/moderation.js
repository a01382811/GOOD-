const fs = require('fs');

// Fichier pour stocker les avertissements
const warningsFile = './database/warnings.json';

// Initialiser le fichier si inexistant
if (!fs.existsSync(warningsFile)) {
    fs.writeFileSync(warningsFile, JSON.stringify({}, null, 2));
}

module.exports = (sock) => {
    // Fonction pour sauvegarder les warnings
    const saveWarnings = (warnings) => {
        fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));
    };
    
    // Fonction pour charger les warnings
    const loadWarnings = () => {
        try {
            return JSON.parse(fs.readFileSync(warningsFile, 'utf-8'));
        } catch(e) {
            return {};
        }
    };
    
    return {
        // Avertir un membre
        warn: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return await sock.sendMessage(sender, { text: '⚠️ Commande de groupe uniquement !' });
            
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || !mentioned[0]) {
                return await sock.sendMessage(sender, { text: '⚠️ Mentionnez la personne à avertir !\nExemple: .warn @utilisateur' });
            }
            
            const target = mentioned[0];
            const warnings = loadWarnings();
            
            if (!warnings[target]) {
                warnings[target] = { count: 1, reasons: [] };
            } else {
                warnings[target].count++;
            }
            
            if (args) {
                warnings[target].reasons.push(args);
            }
            
            saveWarnings(warnings);
            
            await sock.sendMessage(sender, { text: `⚠️ *Avertissement* ⚠️\n\n@${target.split('@')[0]} a reçu un avertissement !\nTotal: ${warnings[target].count}/3`, mentions: [target] });
            
            // Si 3 warnings, expulser
            if (warnings[target].count >= 3) {
                await sock.groupParticipantsUpdate(sender, [target], 'remove');
                delete warnings[target];
                saveWarnings(warnings);
                await sock.sendMessage(sender, { text: `🚫 @${target.split('@')[0]} a été expulsé pour 3 avertissements !`, mentions: [target] });
            }
        },
        
        // Enlever un avertissement
        unwarn: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || !mentioned[0]) {
                return await sock.sendMessage(sender, { text: '⚠️ Mentionnez la personne !' });
            }
            
            const target = mentioned[0];
            const warnings = loadWarnings();
            
            if (warnings[target] && warnings[target].count > 0) {
                warnings[target].count--;
                if (warnings[target].count === 0) {
                    delete warnings[target];
                }
                saveWarnings(warnings);
                await sock.sendMessage(sender, { text: `✅ Avertissement retiré à @${target.split('@')[0]}`, mentions: [target] });
            } else {
                await sock.sendMessage(sender, { text: `ℹ️ @${target.split('@')[0]} n'a pas d'avertissement`, mentions: [target] });
            }
        },
        
        // Voir les warnings d'un membre
        warnings: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || !mentioned[0]) {
                return await sock.sendMessage(sender, { text: '⚠️ Mentionnez la personne !' });
            }
            
            const target = mentioned[0];
            const warnings = loadWarnings();
            const count = warnings[target]?.count || 0;
            
            await sock.sendMessage(sender, { text: `📋 Avertissements de @${target.split('@')[0]}: ${count}/3`, mentions: [target] });
        },
        
        // Mute un membre
        mute: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || !mentioned[0]) {
                return await sock.sendMessage(sender, { text: '⚠️ Mentionnez la personne à mute !' });
            }
            
            // Récupérer la durée (ex: 10m, 1h)
            let duration = 30; // minutes par défaut
            if (args) {
                const match = args.match(/(\d+)([mh])/);
                if (match) {
                    const value = parseInt(match[1]);
                    if (match[2] === 'h') duration = value * 60;
                    else if (match[2] === 'm') duration = value;
                }
            }
            
            await sock.sendMessage(sender, { text: `🔇 @${mentioned[0].split('@')[0]} a été muet pour ${duration} minutes !`, mentions: [mentioned[0]] });
            
            // Dé-mute après la durée
            setTimeout(async () => {
                await sock.sendMessage(sender, { text: `🔊 @${mentioned[0].split('@')[0]} n'est plus muet !`, mentions: [mentioned[0]] });
            }, duration * 60 * 1000);
        },
        
        // Unmute
        unmute: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentioned || !mentioned[0]) {
                return await sock.sendMessage(sender, { text: '⚠️ Mentionnez la personne à dé-mute !' });
            }
            
            await sock.sendMessage(sender, { text: `🔊 @${mentioned[0].split('@')[0]} a été démuet !`, mentions: [mentioned[0]] });
        },
        
        // Verrouiller le groupe
        lockgroup: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            await sock.groupSettingUpdate(sender, 'announcement');
            await sock.sendMessage(sender, { text: '🔒 Groupe verrouillé ! Seuls les admins peuvent envoyer des messages.' });
        },
        
        // Déverrouiller
        unlockgroup: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            await sock.groupSettingUpdate(sender, 'not_announcement');
            await sock.sendMessage(sender, { text: '🔓 Groupe déverrouillé ! Tout le monde peut envoyer des messages.' });
        }
    };
};
