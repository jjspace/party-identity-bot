/**
 * @typedef Inhibition Reason and response for a command being prevented from running. The `reason` will be logged to the console, use this for simple more programmatic identification. The `response` will be sent back to the channel the command came from. If the response is `falsey` nothing will be sent.
 * @property {string} reason - reason for inhibition
 * @property {string} response - message to send back to the user
 */
/**
 * @callback Inhibitor This will make a decision on whether to prevent access to a command. Should return false to allow the command. A `string` or `Inhibition` will prevent the command from being run. A response is only sent in chat if you return an Inhibition.
 * @param {import('discord.js').Message} message The message triggering the command
 * @returns {boolean | string | Inhibition}
 */

module.exports = { botDev: require('./botDev') };
