//@ts-check
const {
  MessageMentions: { USERS_PATTERN },
} = require('discord.js');
const { updateIdentity, getSet } = require('../../db/dbClient');
const { SET_NAME_PATTERN } = require('../../enums');
const { noMentionOpts } = require('../../utils');

/** @type {import('../index').Command} */
module.exports = {
  name: 'updateset',
  description: 'Update the identities for a given set using the members current nicknames',
  usage: 'updateset [set name] [?@member]',
  arguments: {
    min: 1,
    max: 2,
    structure: [[SET_NAME_PATTERN], [SET_NAME_PATTERN, USERS_PATTERN]],
  },
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const setName = args.shift();

    const set = await getSet(guildId, setName, true);
    if (!set) {
      message.channel.send(`Set \`${setName}\` not found. Make sure you spelled it correctly`);
      return;
    }

    if (args.length) {
      // update a specific member
      const user = message.mentions.users.first();
      await updateIdentity(set.id, user.id, message.guild.member(user.id).nickname);
      message.channel.send(`Identity of ${user} updated in set \`${setName}\``, noMentionOpts);
      return;
    }

    await set.identities.forEach(async (identity) => {
      await updateIdentity(set.id, identity.userId, message.guild.member(identity.userId).nickname);
    });

    message.channel.send(`Set \`${setName}\` updated`);
  },
};
