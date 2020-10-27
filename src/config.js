// Ensure required ENV vars are set as outlined here
// https://vancelucas.com/blog/ensure-required-env-variables-are-set-in-node-js/
let requiredEnv = ['DISCORD_BOT_TOKEN', 'LOG_FILE_NAME', 'DATABASE_FILE', 'DEVELOPER_IDS'];
let unsetEnv = requiredEnv.filter((env) => !(typeof process.env[env] !== 'undefined'));

if (unsetEnv.length > 0) {
  throw new Error('Required ENV variables are not set: [' + unsetEnv.join(', ') + ']');
}

module.exports = {
  discordBotToken: process.env.DISCORD_BOT_TOKEN,
  logFileName: process.env.LOG_FILE_NAME,
  databaseFile: process.env.DATABASE_FILE,
  developerIds: process.env.DEVELOPER_IDS.split(','),
};
