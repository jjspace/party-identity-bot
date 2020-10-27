//@ts-check

const { getSet, updateIdentity } = require('../../db/dbClient');
const { SET_NAME_PATTERN } = require('../../enums');

/** @type {import('../index').Command} */
module.exports = {
  name: 'updateselfinset',
  description:
    'Update your own nickname in the specified set. Uses current nickname if not specified',
  usage: 'updateselfinset [set name] [?new nickname]',
  arguments: {
    min: 1,
    max: 2,
    structure: [[SET_NAME_PATTERN], [SET_NAME_PATTERN, /.*/]],
  },
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const setName = args.shift();
    let newNickname = args.join(' ');
    const authorNick = message.guild.member(message.author).nickname;

    try {
      const set = await getSet(guildId, setName);
      if (!set) {
        message.channel.send(`Set \`${setName}\` not found. Make sure you spelled it correctly`);
        return;
      }
      await updateIdentity(set.id, message.author.id, newNickname || authorNick);
      message.channel.send(`Identity updated for set \`${setName}\``);
    } catch (err) {
      message.channel.send('an unknown error occurred');
    }
  },
};
