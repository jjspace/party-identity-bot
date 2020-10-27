// @ts-check

const { getGroup, getGroups } = require('../../db/dbClient');
const { noMentionOpts } = require('../../utils');
const createGroupCmd = require('./creategroup');

/** @type {import('../index').Command} */
module.exports = {
  name: 'groups',
  description:
    "List all current groups. If more than 3 request a specific group's details to see member list",
  usage: 'groups [?group name]',
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const groupName = args.shift();

    if (groupName) {
      // requesting single group's details
      const group = await getGroup(guildId, groupName, true);
      if (!group) {
        message.channel.send(
          `Group \`${groupName}\` not found. Check you spelled the name correctly.`
        );
        return;
      }
      let outStr = `group: ${group.name}`;
      const { members } = group;
      if (members) {
        members.forEach((member) => {
          outStr += `\n${message.guild.member(member.userId)}`;
        });
      }
      message.channel.send(outStr, noMentionOpts);
    } else {
      // return all group details
      const groupList = await getGroups(guildId);

      if (!groupList.length) {
        message.channel.send(`You have no groups, create one with \`${createGroupCmd.usage}\``);
        return;
      }

      message.channel.send(`groups: ${groupList.map((group) => group.name)}`);
    }
  },
};
