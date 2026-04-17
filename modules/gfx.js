module.exports = (sock) => {
    const gfxCommands = {};
    
    // Créer les 12 commandes GFX
    for (let i = 1; i <= 12; i++) {
        gfxCommands[`gfx${i}`] = async (msg, args, sender) => {
            if (!args) {
                await sock.sendMessage(sender, { text: `🎨 *GFX${i}*\nUtilisation: .gfx${i} [votre texte]\nExemple: .gfx${i} KILLER` });
            } else {
                await sock.sendMessage(sender, { text: `🎨 GFX${i} - Texte: "${args}"\n✨ Effet graphique généré !` });
            }
        };
    }
    
    return gfxCommands;
};
