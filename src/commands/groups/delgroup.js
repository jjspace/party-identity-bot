//@ts-check

const { deleteGroup } = require('../../db/dbClient');
const logger = require('../../logger');

/** @type {import('../index').Command} */
module.exports = {
  name: 'delgroup',
  description:
    'Remove a group from this server, there is no confirmation, make sure you really want to do this.',
  usage: 'delgroup [group name]',
  args: { exact: 1, errMsg: 'Must provide 1 group name' },
  execute: async (message, args) => {
    const { id: guildId } = message.guild;

    const groupName = args.shift();

    try {
      const rowsDeleted = await deleteGroup(guildId, groupName);
      switch (rowsDeleted) {
        case 0:
          message.channel.send(
            `Group \`${groupName}\` not found. Make sure you typed the name correctly`
          );
          return;
        case 1:
          message.channel.send(`Deleted group: \`${groupName}\``);
          return;
        default:
          message.channel.send(
            'Deleted more than 1 group. This should not have happened. Please contact the bot dev'
          );
          logger.error('Deleted more than 1 group in command `delgroup`');
          return;
      }
    } catch (err) {
      message.channel.send(
        `There was a problem deleting the group \`${groupName}\`. Make sure you typed the name right`
      );
    }
  },
};
