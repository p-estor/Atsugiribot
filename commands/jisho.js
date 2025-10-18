const { buscarPalabra, formatearResultado } = require('../utils/jishoAPI');

module.exports = {
    command: '/jisho',
    description: 'Busca una palabra en el diccionario japonés Jisho',
    usage: '/jisho <palabra>',
    async execute(bot, msg, args) {
        const chatId = msg.chat.id;

        // Verificar que se proporcionó una palabra
        if (args.length === 0) {
            return bot.sendMessage(chatId, 
                '❌ Por favor proporciona una palabra para buscar.\n' +
                'Uso: `/jisho <palabra>`',
                { parse_mode: 'Markdown' }
            );
        }

        const query = args.join(' ');

        // Mensaje de "buscando..."
        const loadingMsg = await bot.sendMessage(chatId, '🔍 Buscando en Jisho...');

        try {
            // Buscar en la API
            const data = await buscarPalabra(query);
            
            // Formatear resultado
            const resultado = formatearResultado(data);

            // Editar el mensaje con el resultado
            await bot.editMessageText(resultado, {
                chat_id: chatId,
                message_id: loadingMsg.message_id,
                parse_mode: 'Markdown'
            });

        } catch (error) {
            console.error('Error en comando jisho:', error);
            await bot.editMessageText(
                '❌ Hubo un error al buscar en Jisho. Inténtalo de nuevo más tarde.',
                {
                    chat_id: chatId,
                    message_id: loadingMsg.message_id
                }
            );
        }
    }
};