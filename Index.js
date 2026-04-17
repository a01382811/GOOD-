const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const config = require('./config');

// Importer tous les modules
const ownerModule = require('./modules/owner');
const groupModule = require('./modules/group');
const moderationModule = require('./modules/moderation');
const antiModule = require('./modules/anti');
const downloaderModule = require('./modules/downloader');
const stickerModule = require('./modules/sticker');
const animeModule = require('./modules/anime');
const voiceModule = require('./modules/voice');
const gfxModule = require('./modules/gfx');
const ephotoModule = require('./modules/ephoto');
const funModule = require('./modules/fun');
const othersModule = require('./modules/others');

// Créer les dossiers nécessaires
const dirs = ['./database', './tmp', './auth_info'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Initialiser la base de données
if (!fs.existsSync(config.dbPath)) {
    fs.writeFileSync(config.dbPath, JSON.stringify({ usersCount: 0, groupsCount: 0, commandsUsed: 0, startTime: Date.now() }, null, 2));
}

// Mode global
global.mode = 'public';

async function startBot() {
    console.log(`\n🔥 ${config.botName} v${config.version} - GOD EDITION`);
    console.log(`👑 Owner: ${config.ownerNumber} (${config.ownerName})\n`);
    
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: 'silent' }),
        browser: [`${config.botName}`, 'Chrome', '2026']
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    // Afficher le QR code
    sock.ev.on('connection.update', (update) => {
        const { qr, connection, lastDisconnect } = update;
        
        if (qr) {
            console.log('\n📱 SCANNE CE QR CODE AVEC WHATSAPP :\n');
            qrcode.generate(qr, { small: true });
            console.log('\n⏳ En attente de scan...\n');
        }
        
        if (connection === 'open') {
            console.log('✅ BOT CONNECTÉ AVEC SUCCÈS !');
            console.log(`🤖 ${config.botName} est prêt à l'emploi\n`);
        }
        
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                console.log('🔄 Reconnexion dans 5 secondes...');
                setTimeout(startBot, 5000);
            }
        }
    });
    
    // Vérifier si l'utilisateur est le propriétaire
    const isOwner = (user) => {
        const cleanUser = user.replace(/[^0-9]/g, '');
        const cleanOwner = config.ownerNumber.replace(/[^0-9]/g, '');
        return cleanUser === cleanOwner || cleanUser.includes(cleanOwner);
    };
    
    // Gestion des messages
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        const sender = msg.key.remoteJid;
        const isGroup = sender.endsWith('@g.us');
        const user = isGroup ? msg.key.participant : sender;
        
        // Mode self : seul le owner peut utiliser le bot
        if (global.mode === 'self' && !isOwner(user)) return;
        
        let text = '';
        if (msg.message.conversation) text = msg.message.conversation;
        else if (msg.message.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;
        else return;
        
        // Trouver le préfixe
        const prefix = config.prefix.find(p => text.startsWith(p));
        if (!prefix) return;
        
        const cmd = text.slice(prefix.length).split(' ')[0].toLowerCase();
        const args = text.slice(prefix.length + cmd.length).trim();
        
        // Mettre à jour les stats
        try {
            const stats = JSON.parse(fs.readFileSync(config.dbPath, 'utf-8'));
            stats.commandsUsed = (stats.commandsUsed || 0) + 1;
            fs.writeFileSync(config.dbPath, JSON.stringify(stats, null, 2));
        } catch(e) {}
        
        console.log(`📩 Commande: ${cmd} | User: ${user.split('@')[0]} | Group: ${isGroup ? 'Oui' : 'Non'}`);
        
        // Regrouper toutes les commandes
        const allCommands = {
            // Owner
            ...ownerModule(sock, config, isOwner),
            // Groupes
            ...groupModule(sock),
            // Modération
            ...moderationModule(sock),
            // Anti
            ...antiModule(sock),
            // Download
            ...downloaderModule(sock),
            // Stickers
            ...stickerModule(sock),
            // Anime
            ...animeModule(sock),
            // Voice
            ...voiceModule(sock),
            // GFX
            ...gfxModule(sock),
            // Ephoto
            ...ephotoModule(sock),
            // Fun
            ...funModule(sock),
            // Others
            ...othersModule(sock)
        };
        
        if (allCommands[cmd]) {
            try {
                await allCommands[cmd](msg, args, sender, user, isGroup, isOwner);
            } catch (err) {
                console.error(`❌ Erreur commande ${cmd}:`, err.message);
                await sock.sendMessage(sender, { text: `❌ Erreur: ${err.message}` });
            }
        }
    });
    
    // Anti-appels
    sock.ev.on('call', async (calls) => {
        for (const call of calls) {
            if (call.status === 'offer') {
                await sock.sendMessage(call.from, { text: '📵 Désolé, je ne reçois pas d\'appels. Envoyez un message !' });
            }
        }
    });
}

startBot().catch(console.error);
