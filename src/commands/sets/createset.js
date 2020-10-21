//@ts-check

const { createSet, nicksFromMentions } = require('../../db/dbClient');

/** @type {import('../index').Command} */
module.exports = {
  name: 'createset',
  description: 'Create a new set of members using their current nicknames as identities',
  usage: 'createset [set name] [@member1] [@member2] [@member3]...',
  args: { min: 2, errMsg: 'Must provide a set name and at least 1 user mention' },
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const [setName, ...members] = args;

    const userMentions = message.mentions.users;
    const nickList = nicksFromMentions(message.guild, userMentions);

    try {
      const newSet = await createSet(guildId, setName, nickList);
      message.channel.send(`Set created with name: ${newSet.name}`);
    } catch (err) {
      message.channel.send(
        'There was an error creating that set. Please try again in a bit. Set names must be unique, check that it is'
      );
    }
  },
};
