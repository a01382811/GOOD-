module.exports = (sock) => {
    const truths = [
        "Quel est ton plus grand secret ?",
        "As-tu déjà menti à ton meilleur ami ?",
        "Quelle est ta plus grande peur ?",
        "As-tu déjà triché à un examen ?"
    ];
    
    const dares = [
        "Fais 10 pompes !",
        "Envoie un message à ton ex",
        "Fais une danse idiote",
        "Montre ton dernier selfie"
    ];
    
    return {
        // 8 Ball magique
        '8ball': async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '🎱 Posez une question !' });
            const reponses = ['Oui', 'Non', 'Peut-être', 'Sûrement', 'Jamais', 'Absolument'];
            const reponse = reponses[Math.floor(Math.random() * reponses.length)];
            await sock.sendMessage(sender, { text: `🎱 *Question:* ${args}\n🎱 *Réponse:* ${reponse}` });
        },
        
        // Vérité
        truth: async (msg, args, sender) => {
            const truth = truths[Math.floor(Math.random() * truths.length)];
            await sock.sendMessage(sender, { text: `💬 *VÉRITÉ*\n${truth}` });
        },
        
        // Action
        dare: async (msg, args, sender) => {
            const dare = dares[Math.floor(Math.random() * dares.length)];
            await sock.sendMessage(sender, { text: `🎯 *ACTION*\n${dare}` });
        },
        
        // Blague
        joke: async (msg, args, sender) => {
            const blagues = [
                "Pourquoi les plombiers sont-ils toujours fatigués ? Parce qu'ils passent leur temps à déboucher !",
                "Que dit une imprimante pour draguer ? T'as l'impression que je te plais ?",
                "Pourquoi les poissons n'aiment pas l'informatique ? Parce qu'ils ont peur du net !"
            ];
            await sock.sendMessage(sender, { text: `😂 *BLAGUE*\n${blagues[Math.floor(Math.random() * blagues.length)]}` });
        },
        
        // Mème
        meme: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🖼️ Génération de mème...' });
        },
        
        // Citation de film
        moviequote: async (msg, args, sender) => {
            const citations = [
                "May the force be with you - Star Wars",
                "I'll be back - Terminator",
                "My precious - Le Seigneur des Anneaux"
            ];
            await sock.sendMessage(sender, { text: `🎬 *CITATION CINÉMA*\n${citations[Math.floor(Math.random() * citations.length)]}` });
        },
        
        // Conseil
        advice: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '💡 *CONSEIL*: Restez toujours positif et souriant !' });
        },
        
        // Fait amusant
        funfact: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '📚 *FUN FACT*: Les pandas passent 12 heures par jour à manger !' });
        },
        
        // Fait scientifique
        fact: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🔬 *FAIT SCIENTIFIQUE*: L\'eau bout à 100°C' });
        },
        
        // Proposition
        propose: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '💍 Veux-tu m\'épouser ? 💍' });
        },
        
        // Baiser
        kiss: async (msg, args, sender) => {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (mentioned && mentioned[0]) {
                await sock.sendMessage(sender, { text: `😘 @${sender.split('@')[0]} embrasse @${mentioned[0].split('@')[0]} 😘`, mentions: [sender, mentioned[0]] });
            } else {
                await sock.sendMessage(sender, { text: '😘 Bisous à toi !' });
            }
        },
        
        // Câlin
        hug: async (msg, args, sender) => {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (mentioned && mentioned[0]) {
                await sock.sendMessage(sender, { text: `🤗 @${sender.split('@')[0]} fait un câlin à @${mentioned[0].split('@')[0]} 🤗`, mentions: [sender, mentioned[0]] });
            } else {
                await sock.sendMessage(sender, { text: '🤗 Câlin virtuel pour toi !' });
            }
        },
        
        // Amour
        love: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '❤️ Je t\'aime ❤️' });
        },
        
        // Rupture
        breakup: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '💔 C\'est fini entre nous... 💔' });
        }
    };
};
