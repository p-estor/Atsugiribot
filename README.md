# Atsugiribot 🤖 (Bot de Telegram)
Bot de Telegram autónomo desarrollado en Node.js especializado en procesar y descargar directamente contenido multimedia de Twitter/X.

---

## 🚀 Características
*   **Descarga Inteligente:** Obtiene el enlace directo del vídeo utilizando la API rápida de `fxtwitter` para agilizar la entrega.
*   **Lógica de Contingencia (Fallback):** Si la API externa falla (debido a restricciones o contenido sensible), el bot ejecuta internamente comandos de consola utilizando `yt-dlp` mediante sesiones asíncronas en el servidor VPS.
*   **Persistencia:** Gestionado de forma persistente en segundo plano mediante **PM2** en un servidor VPS Linux.

---

## 🛠️ Stack Tecnológico
*   **Entorno de Ejecución:** Node.js
*   **Librerías principales:** `node-telegram-bot-api`, `axios`, `dotenv`.
*   **Dependencias de Sistema:** `yt-dlp` instalado en el servidor Linux.

---

## 📦 Configuración
Para correr el bot en local, crea un archivo `.env` en la raíz con tus credenciales:
```env
TELEGRAM_TOKEN="tu_token_de_telegram_bot"
```
Inicia el bot con:
```bash
node index.js
```
o mediante PM2 para producción:
```bash
pm2 start index.js --name Atsugiribot
```
