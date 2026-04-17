module.exports = (sock) => {
    return {
        // Ajouter un membre
        add: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) {
                return await sock.sendMessage(sender, { text: '⚠️ Cette commande est uniquement pour les groupes !' });
            }
            await sock.sendMessage(sender, { text: '✅ Pour ajouter un membre, répondez à son message avec .add' });
        },
        
        // Expulser un membre
        kick: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return await sock.sendMessage(sender, { text: '⚠️ Commande de groupe uniquement !' });
            
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (mentioned && mentioned[0]) {
                await sock.sendMessage(sender, { text: `✅ Membre expulsé: ${mentioned[0]}` });
            } else {
                await sock.sendMessage(sender, { text: '⚠️ Mentionnez la personne à expulser !' });
            }
        },
        
        // Promouvoir admin
        promote: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (mentioned && mentioned[0]) {
                await sock.groupParticipantsUpdate(sender, [mentioned[0]], 'promote');
                await sock.sendMessage(sender, { text: `✅ ${mentioned[0]} est maintenant admin !` });
            }
        },
        
        // Rétrograder admin
        demote: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (mentioned && mentioned[0]) {
                await sock.groupParticipantsUpdate(sender, [mentioned[0]], 'demote');
                await sock.sendMessage(sender, { text: `✅ ${mentioned[0]} n'est plus admin !` });
            }
        },
        
        // Mentionner tous les membres
        tagall: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            
            try {
                const groupMetadata = await sock.groupMetadata(sender);
                const participants = groupMetadata.participants;
                let message = `📢 *TAG ALL* 📢\n\n👑 Message: ${args || 'Pas de message'}\n\n👥 Membres:\n`;
                
                for (let participant of participants) {
                    message += `@${participant.id.split('@')[0]}\n`;
                }
                
                await sock.sendMessage(sender, { text: message, mentions: participants.map(p => p.id) });
            } catch(e) {
                await sock.sendMessage(sender, { text: '❌ Erreur lors du tagall' });
            }
        },
        
        // Lien du groupe
        grouplink: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            
            try {
                const code = await sock.groupInviteCode(sender);
                const link = `https://chat.whatsapp.com/${code}`;
                await sock.sendMessage(sender, { text: `🔗 *Lien du groupe:*\n${link}` });
            } catch(e) {
                await sock.sendMessage(sender, { text: '❌ Impossible de récupérer le lien' });
            }
        },
        
        // Infos du groupe
        groupinfo: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            
            try {
                const metadata = await sock.groupMetadata(sender);
                const subject = metadata.subject;
                const description = metadata.desc || 'Aucune description';
                const memberCount = metadata.participants.length;
                const adminCount = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
                
                await sock.sendMessage(sender, {
                    text: `📊 *INFORMATIONS GROUPE*\n\n📛 Nom: ${subject}\n📝 Description: ${description}\n👥 Membres: ${memberCount}\n👑 Admins: ${adminCount}\n🔗 Créé le: ${metadata.creation ? new Date(metadata.creation * 1000).toLocaleDateString() : 'Inconnu'}`
                });
            } catch(e) {
                await sock.sendMessage(sender, { text: '❌ Erreur lors de la récupération des infos' });
            }
        },
        
        // Fermer le groupe (envoi de messages)
        closetime: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            await sock.groupSettingUpdate(sender, 'announcement');
            await sock.sendMessage(sender, { text: '🔒 Groupe fermé - Seuls les admins peuvent envoyer des messages' });
        },
        
        // Ouvrir le groupe
        opentime: async (msg, args, sender, user, isGroup) => {
            if (!isGroup) return;
            await sock.groupSettingUpdate(sender, 'not_announcement');
            await sock.sendMessage(sender, { text: '🔓 Groupe ouvert - Tout le monde peut envoyer des messages' });
        }
    };
};
