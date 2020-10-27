//@ts-check

const { createGroup } = require('../../db/dbClient');

/** @type {import('../index').Command} */
module.exports = {
  name: 'creategroup',
  description: 'Create a new group of members to quickly save sets of nicknames',
  usage: 'creategroup [group name] [@member1] [@member2] [@member3] ...',
  args: {
    min: 2,
  },
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const groupName = args.shift();
    const mentions = message.mentions.users;

    const userIds = mentions.map((mention) => mention.id);

    try {
      const newGroup = await createGroup(guildId, groupName, userIds);
      message.channel.send(`Group created with name: ${newGroup.name}`);
    } catch (err) {
      message.channel.send(
        'There was an error creating that group. Please try again in a bit. Group names must be unique, check that it is'
      );
    }
  },
};
