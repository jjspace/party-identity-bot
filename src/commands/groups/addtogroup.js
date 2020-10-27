//@ts-check
const {
  MessageMentions: { USERS_PATTERN },
} = require('discord.js');
const { ValidationError } = require('sequelize');
const { getGroup, createGroupMember } = require('../../db/dbClient');
const { GROUP_NAME_PATTERN } = require('../../enums');
const { noMentionOpts } = require('../../utils');

/** @type {import('../index').Command} */
module.exports = {
  name: 'addtogroup',
  description: 'Add a user to an existing group',
  usage: 'addtogroup [@mention] [group name]',
  arguments: {
    exact: 2,
    errorMsg: {
      highMsg: 'Too many arguments, max 2, one user mention and one group name',
      lowMsg: 'Not enough arguments, require 2, user mention and group name',
    },
    structure: [
      [USERS_PATTERN, GROUP_NAME_PATTERN],
      [GROUP_NAME_PATTERN, USERS_PATTERN],
    ],
  },
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const mentionedUsers = message.mentions.users;

    if (mentionedUsers.size !== 1) {
      message.channel.send('Must mention one user');
      return;
    }

    let groupName = args.pop();
    if (groupName.match(USERS_PATTERN)) {
      // if the second arg is the mention, pop again to try and use the first as group name
      groupName = args.pop();
    }
    const user = mentionedUsers.first();

    const group = await getGroup(guildId, groupName);
    if (!group) {
      message.channel.send(
        `Unable to find group: ${groupName}. Check you spelled the name correctly`
      );
      return;
    }

    try {
      await createGroupMember(group.id, user.id);
      message.channel.send(`User ${user} added to group \`${groupName}\`.`, noMentionOpts);
    } catch (err) {
      if (err instanceof ValidationError) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          message.channel.send(`That user is already part of the group \`${groupName}\`.`);
          return;
        }
      }
      message.channel.send('There was an unexpected problem creating that identity.');
    }
  },
};
