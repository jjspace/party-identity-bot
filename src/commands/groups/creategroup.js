//@ts-check

const { Group } = require('../../db/db');
const { createGroup } = require('../../db/dbClient');

/** @type {import('../index').Command} */
module.exports = {
  name: 'creategroup',
  description: 'Create a new group of members to quickly save sets of nicknames',
  usage: 'creategroup [group name] [@member1] [@member2] [@member3] ...',
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const [groupName, ...members] = args;

    try {
      const newGroup = await createGroup(guildId, groupName, members);
      message.channel.send(`Group created with name: ${newGroup.name}`);
    } catch (err) {
      message.channel.send(
        'There was an error creating that group. Please try again in a bit. Group names must be unique, check that it is'
      );
    }
  },
};
