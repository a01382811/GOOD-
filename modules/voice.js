module.exports = (sock) => {
    return {
        // Effet basse
        bass: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🎵 Effet BASS activé - Envoyez un audio et répondez avec .bass' });
        },
        
        // Effet blown
        blown: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🎵 Effet BLOWN activé' });
        },
        
        // Earrape
        earrape: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '⚠️ Effet EARAPE - Volume élevé ⚠️' });
        },
        
        // Voix grave
        deep: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🎵 Effet DEEP - Voix grave' });
        },
        
        // Accéléré
        fast: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🎵 Effet FAST - Son accéléré' });
        },
        
        // Nightcore
        nightcore: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🎵 Effet NIGHTCORE - Version accélérée + aiguë' });
        },
        
        // Ralenti
        slow: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🎵 Effet SLOW - Son ralenti' });
        },
        
        // Ecureuil
        squirrel: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🐿️ Effet SQUIRREL - Voix aiguë' });
        },
        
        // Reverse
        reverse: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🔄 Effet REVERSE - Son inversé' });
        },
        
        // Robot
        robot: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🤖 Effet ROBOT - Voix robotique' });
        },
        
        // Smooth
        smooth: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🎵 Effet SMOOTH - Son lissé' });
        },
        
        // Echo
        echo: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🗣️ Effet ECHO - Avec réverbération' });
        }
    };
};
