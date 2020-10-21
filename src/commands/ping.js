// @ts-check
/** @type {import('./index').Command} */
module.exports = {
  name: 'ping',
  description: 'Ping Pong response to check is bot is alive',
  execute(message) {
    message.channel.send('Pong');
  },
};
