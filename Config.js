const fs = require('fs');
require('dotenv').config();

module.exports = {
    // Owner Info - TON NUMÉRO INTÉGRÉ
    ownerName: "DEV KILLER",
    ownerNumber: process.env.OWNER_NUMBER || "22784566540",
    ownerNumberFull: "22784566540@s.whatsapp.net",
    botName: "KILLER MD",
    version: "2026-GOD",
    prefix: ['.', '!', '#', '/', '?', '$', '&'],
    
    // Session
    sessionId: process.env.SESSION_ID || "KILLER_MD_22784566540",
    
    // APIs
    apis: {
        giphy: process.env.GIPHY_API || "",
        openai: process.env.OPENAI_API || "",
        weather: process.env.WEATHER_API || "",
        movie: "https://api.themoviedb.org/3",
        anime: "https://api.jikan.moe/v4",
        yt: "https://yt-api.com"
    },
    
    // Anti-spam
    spam: {
        maxMessages: 5,
        timeWindow: 5000,
        muteDuration: 300000
    },
    
    // Database
    dbPath: './database/db.json',
    warningsPath: './database/warnings.json',
    
    // Messages par défaut
    messages: {
        notOwner: "❌ Seul le propriétaire *wa.me/22784566540* peut utiliser cette commande !",
        error: "❌ Erreur, réessaie plus tard.",
        loading: "⏳ Traitement en cours..."
    }
};
