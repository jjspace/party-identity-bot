// @ts-check
const {
  MessageMentions: { USERS_PATTERN },
} = require('discord.js');
const { ValidationError } = require('sequelize');
const { getSet, createIdentity } = require('../../db/dbClient');
const { SET_NAME_PATTERN } = require('../../enums');
const { noMentionOpts } = require('../../utils');
const updateset = require('./updateset');

/** @type {import('../index').Command} */
module.exports = {
  name: 'addtoset',
  description: 'Add a user to an existing identity set',
  usage: 'addtoset [@mention] [set name]',
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
      const newIdentity = await createIdentity(
        set.id,
        user.id,
        message.guild.member(user).nickname
      );
      message.channel.send(`Identity Created for ${user} in set \`${setName}\`.`, noMentionOpts);
    } catch (err) {
      if (err instanceof ValidationError) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          message.channel.send(
            `That user is already part of the set \`${setName}\`. If you're trying to update their name use: \`${updateset.usage}\``
          );
          return;
        }
      }
      message.channel.send('There was an unexpected problem creating that identity.');
    }
  },
};
