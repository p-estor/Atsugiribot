const axios = require('axios');

/**
 * Busca una palabra en Jisho.org
 * @param {string} query - La palabra a buscar
 * @returns {Promise<Object>} - Datos de la API de Jisho
 */
async function buscarPalabra(query) {
    try {
        const response = await axios.get(
            `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(query)}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al consultar Jisho API:', error);
        throw new Error('No se pudo conectar con Jisho');
    }
}

/**
 * Formatea los resultados de Jisho en un mensaje legible
 * @param {Object} data - Datos de la API de Jisho
 * @returns {string} - Mensaje formateado
 */
function formatearResultado(data) {
    if (!data.data || data.data.length === 0) {
        return '❌ No se encontraron resultados.';
    }

    const resultado = data.data[0]; // Tomamos el primer resultado
    const palabra = resultado.japanese[0];
    const sentidos = resultado.senses;

    let mensaje = '**Palabra:** ';
    
    // Palabra en kanji (si existe)
    if (palabra.word) {
        mensaje += `${palabra.word}`;
    }
    
    // Lectura en hiragana/katakana
    if (palabra.reading) {
        mensaje += ` (${palabra.reading})`;
    }

    mensaje += '\n\n';

    // Significados (limitamos a los primeros 3)
    mensaje += '**Significados:**\n';
    sentidos.slice(0, 3).forEach((sentido, index) => {
        const definiciones = sentido.english_definitions.join(', ');
        const partes = sentido.parts_of_speech.join(', ');
        
        mensaje += `${index + 1}. ${definiciones}`;
        if (partes) {
            mensaje += ` _(${partes})_`;
        }
        mensaje += '\n';
    });

    // Etiquetas adicionales (JLPT, común, etc.)
    if (resultado.jlpt && resultado.jlpt.length > 0) {
        mensaje += `\n📚 **JLPT:** ${resultado.jlpt.join(', ')}`;
    }

    if (resultado.is_common) {
        mensaje += '\n✨ **Palabra común**';
    }

    return mensaje;
}

module.exports = {
    buscarPalabra,
    formatearResultado
};