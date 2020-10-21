//@ts-check

const { getSets, getSet } = require('../../db/dbClient');
const { noMentionOpts } = require('../../utils');
const createSetCmd = require('./createset');

/** @type {import('../index').Command} */
module.exports = {
  name: 'sets',
  description: 'List all sets for this server. If more than 3 specify a set name to see details',
  usage: 'sets [?set name]',
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const setName = args.shift();

    if (setName) {
      // requesting single set's details
      const set = await getSet(guildId, setName, true);
      if (!set) {
        message.channel.send(`Set \`${setName}\` not found. Check you spelled the name correctly.`);
        return;
      }
      let outStr = `set: ${set.name}`;
      const { identities } = set;
      if (identities) {
        identities.forEach((identity) => {
          const mention = message.guild.member(identity.userId);
          outStr += `\n@${mention.user.username} --> \`${identity.nickname}\``;
        });
      }
      message.channel.send(outStr, noMentionOpts);
    } else {
      // return all set details
      const setList = await getSets(guildId);

      if (!setList.length) {
        message.channel.send(`You have no sets, create one with \`${createSetCmd.usage}\``);
        return;
      }

      message.channel.send(`sets: ${setList.map((set) => set.name)}`);
    }
  },
};
