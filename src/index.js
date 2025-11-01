require('dotenv').config();
const fs = require('fs');
const DiscordBot = require('./client/DiscordBot');

// ensure terminal.log exists
fs.writeFileSync('./terminal.log', '', 'utf-8');

// Helpful early check: ensure the bot token is provided via environment or .env
if (!process.env.CLIENT_TOKEN || process.env.CLIENT_TOKEN.length === 0) {
	const warn = 'CLIENT_TOKEN is not set. Create a .env file with the line: CLIENT_TOKEN=YOUR_BOT_TOKEN_HERE';
	// Print to console and write to terminal.log to make it easy to find
	console.error(warn);
	try { fs.appendFileSync('./terminal.log', warn + '\n', 'utf-8'); } catch (e) {}
	// Exit early to avoid confusing retry loops
	process.exit(1);
}

// Debug print: show first/last 4 chars of token for troubleshooting
const token = process.env.CLIENT_TOKEN;
console.log('[DEBUG] Loaded CLIENT_TOKEN:', token ? `${token.slice(0,4)}...${token.slice(-4)}` : 'undefined');

const client = new DiscordBot();

module.exports = client;

client.connect();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);