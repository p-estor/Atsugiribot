require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Crear instancia del bot con tu token
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

console.log('🚀 Bot de Telegram iniciado...');

// Evento cuando el bot se conecta correctamente
bot.on('polling_error', (error) => {
    console.error('❌ Error de polling:', error);
});

// Escuchar todos los mensajes
bot.on('message', async (msg) => {
    // Ignorar mensajes sin texto o de canales
    if (!msg.text || msg.chat.type === 'channel') return;

    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const userId = msg.from.id;
    const userName = msg.from.first_name || msg.from.username || 'Usuario';

    // Regex para detectar enlaces de Twitter/X
    const twitterRegex = /(https?:\/\/)(?:www\.)?(twitter\.com|x\.com)\/[^\s]+/gi;
    // Regex para detectar enlaces de Instagram
    const instagramRegex = /(https?:\/\/)(?:www\.)?instagram\.com\/[^\s]+/gi;

    let fixedMessage = msg.text;
    let shouldReply = false;

    // Reemplazamos Twitter/X por fxtwitter
    if (twitterRegex.test(msg.text)) {
        fixedMessage = fixedMessage.replace(twitterRegex, (url) => {
            return url.replace(/twitter\.com|x\.com/, "fxtwitter.com");
        });
        shouldReply = true;
    }

    // Reemplazamos Instagram por kkinstagram
    if (instagramRegex.test(msg.text)) {
        fixedMessage = fixedMessage.replace(instagramRegex, (url) => {
            return url.replace(/https:\/\/(www\.)?instagram\.com/, "https://kkinstagram.com");
        });
        shouldReply = true;
    }

    // Si hubo algún cambio, intentamos borrar el mensaje original y enviar el corregido
    if (shouldReply) {
        try {
            // Intentar borrar el mensaje original
            await bot.deleteMessage(chatId, messageId);
            
            // Enviar el mensaje corregido con el nombre del usuario
            await bot.sendMessage(chatId, `${userName}: ${fixedMessage}`, {
                disable_web_page_preview: false // Permite preview de enlaces
            });
            
            console.log(`✅ Mensaje corregido de ${userName}`);
        } catch (err) {
            console.error("❌ Error al procesar mensaje:", err.message);
            
            // Si no se puede borrar (falta de permisos), solo responder
            if (err.message.includes('not enough rights')) {
                await bot.sendMessage(chatId, `${userName}: ${fixedMessage}`, {
                    reply_to_message_id: messageId,
                    disable_web_page_preview: false
                });
                console.log('⚠️ Sin permisos para borrar. Mensaje enviado como respuesta.');
            }
        }
    }
});

// Comando de ayuda opcional
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
        '👋 ¡Hola! Soy un bot que arregla enlaces de Twitter/X e Instagram.\n\n' +
        '🔗 Twitter/X → fxtwitter.com\n' +
        '📸 Instagram → kkinstagram.com\n\n' +
        'Solo envía un enlace y yo me encargo del resto.'
    );
});

console.log('✅ Bot escuchando mensajes...');