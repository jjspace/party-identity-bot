//@ts-check
const {
  MessageMentions: { USERS_PATTERN },
} = require('discord.js');
const { ValidationError } = require('sequelize');
const { getSet, deleteIdentity } = require('../../db/dbClient');
const { SET_NAME_PATTERN } = require('../../enums');
const { noMentionOpts } = require('../../utils');

/** @type {import('../index').Command} */
module.exports = {
  name: 'removefromset',
  description: 'Remove a user from an existing identity set',
  usage: 'removefromset [@mention] [set name]',
  arguments: {
    exact: 2,
    errorMsg: {
      highMsg: 'Too many arguments, max 2, one user mention and one set name',
      lowMsg: 'Not enough arguments, require 2, user mention and set name',
    },
    structure: [
      [USERS_PATTERN, SET_NAME_PATTERN],
      [SET_NAME_PATTERN, USERS_PATTERN],
    ],
  },
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const mentionedUsers = message.mentions.users;

    if (mentionedUsers.size !== 1) {
      message.channel.send('Must mention one user');
      return;
    }

    let setName = args.pop();
    if (setName.match(USERS_PATTERN)) {
      // if the second arg is the mention, pop again to try and use the first as set name
      setName = args.pop();
    }
    const user = mentionedUsers.first();

    const set = await getSet(guildId, setName);
    if (!set) {
      message.channel.send(`Unable to find set: ${setName}. Check you spelled the name correctly`);
      return;
    }

    try {
      const identsRemoved = await deleteIdentity(set.id, user.id);
      if (identsRemoved) {
        message.channel.send(`Removed ${user} from set \`${setName}\`.`, noMentionOpts);
        return;
      }
      message.channel.send('Nothing to remove');
    } catch (err) {
      if (err instanceof ValidationError) {
        message.channel.send(`Unknown validation error: ${err.name}`);
      }
      message.channel.send('There was an unexpected problem creating that identity.');
    }
  },
};
