//@ts-check

const { deleteSet } = require('../../db/dbClient');
const logger = require('../../logger');

/** @type {import('../index').Command} */
module.exports = {
  name: 'delset',
  description:
    'Remove a set from this server, there is no confirmation, make sure you really want to do this.',
  usage: 'delset [set name]',
  args: { exact: 1, errMsg: 'Must provide 1 set name' },
  execute: async (message, args) => {
    const { id: guildId } = message.guild;

    const setName = args.shift();

    try {
      const rowsDeleted = await deleteSet(guildId, setName);
      switch (rowsDeleted) {
        case 0:
          message.channel.send(
            `Set \`${setName}\` not found. Make sure you typed the name correctly`
          );
          return;
        case 1:
          message.channel.send(`Deleted set: \`${setName}\``);
          return;
        default:
          message.channel.send(
            'Deleted more than 1 set. This should not have happened. Please contact the bot dev'
          );
          logger.error(`Deleted more than 1 set in command \`${this.name}\``);
          return;
      }
    } catch (err) {
      message.channel.send(
        `There was a problem deleting the set \`${setName}\`. Make sure you typed the name right`
      );
    }
  },
};
