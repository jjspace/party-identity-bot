//@ts-check
const {
  MessageMentions: { USERS_PATTERN },
} = require('discord.js');
const { ValidationError } = require('sequelize');
const { getGroup, deleteGroupMember } = require('../../db/dbClient');
const { GROUP_NAME_PATTERN } = require('../../enums');
const { noMentionOpts } = require('../../utils');

/** @type {import('../index').Command} */
module.exports = {
  name: 'removefromgroup',
  description: 'Remove a user from an existing group',
  usage: 'removefromgroup [@mention] [group name]',
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
      const groupMembersRemoved = await deleteGroupMember(group.id, user.id);
      if (groupMembersRemoved) {
        message.channel.send(`Removed ${user} from group \`${groupName}\`.`, noMentionOpts);
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
