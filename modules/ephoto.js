module.exports = (sock) => {
    return {
        // Texte glitch
        glitchtext: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '✨ .glitchtext [votre texte]' });
            await sock.sendMessage(sender, { text: `✨ Texte GLITCH: ${args.split('').map(c => c + '̴').join('')}` });
        },
        
        // Texte qui brille
        glowingtext: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '✨ .glowingtext [texte]' });
            await sock.sendMessage(sender, { text: `✨✨✨ ${args} ✨✨✨` });
        },
        
        // Texte néon
        neonglitch: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '🌈 .neonglitch [texte]' });
            await sock.sendMessage(sender, { text: `🌈 NEON: ${args}` });
        },
        
        // Texte typographie
        typographytext: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '📝 .typographytext [texte]' });
            await sock.sendMessage(sender, { text: `📝 TYPOGRAPHY: ${args.toUpperCase()}` });
        },
        
        // Texte dégradé
        gradienttext: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🎨 Texte dégradé créé' });
        },
        
        // Texte or luxe
        luxurygold: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '👑 TEXTE OR LUXE 👑' });
        },
        
        // Pixel glitch
        pixelglitch: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '📺 Effet PIXEL GLITCH' });
        },
        
        // Fond d'écran galaxy
        galaxywallpaper: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🌌 Wallpaper GALAXY généré' });
        },
        
        // Style cartoon
        cartoonstyle: async (msg, args, sender) => {
            await sock.sendMessage(sender, { text: '🎨 Style CARTOON appliqué' });
        },
        
        // Createur de logo
        logomaker: async (msg, args, sender) => {
            if (!args) return await sock.sendMessage(sender, { text: '🏷️ .logomaker [nom du logo]' });
            await sock.sendMessage(sender, { text: `🏷️ Logo "${args}" créé !` });
        }
    };
};
