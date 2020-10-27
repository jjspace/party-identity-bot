//@ts-check

const { ValidationError } = require('sequelize');
const { getGroup, createSet, nicksFromIds } = require('../../db/dbClient');
const { GROUP_NAME_PATTERN, SET_NAME_PATTERN } = require('../../enums');

/** @type {import('../index').Command} */
module.exports = {
  name: 'createsetfromgroup',
  description: 'Add a user to an existing identity set',
  usage: 'creatsetfromgroup [set name] [group name]',
  arguments: {
    exact: 1,
    structure: [SET_NAME_PATTERN, GROUP_NAME_PATTERN],
  },
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const [setName, groupName] = args;

    const group = await getGroup(guildId, groupName, true);

    const nicknames = nicksFromIds(
      message.guild,
      group.members.map((member) => member.userId)
    );
    try {
      const newSet = await createSet(guildId, setName, nicknames);
      message.channel.send(`New set \`${newSet.name}\` created using group \`${groupName}\``);
    } catch (err) {
      if (err instanceof ValidationError) {
        message.channel.send(`Unknown Validation Error: ${err.name}`);
        return;
      }
      message.channel.send('Unknown Error Creating set');
    }
  },
};
