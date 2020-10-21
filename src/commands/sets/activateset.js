//@ts-check

const { GuildMember, DiscordAPIError } = require('discord.js');
const { getSet } = require('../../db/dbClient');
const logger = require('../../logger');
const { noMentionOpts } = require('../../utils');

/** @type {import('../index').Command} */
module.exports = {
  name: 'activateset',
  description: 'Apply a set of identities',
  usage: 'activate [set name]',
  args: { exact: 1 },
  execute: async (message, args) => {
    const { id: guildId } = message.guild;
    const setName = args.shift();

    try {
      const { name, identities } = await getSet(guildId, setName, true);

      const promises = identities.map((identity) => {
        if (identity.userId === message.guild.ownerID) {
          // custom promise reject message for owner to pass the nick they should have to the handler
          return Promise.reject(`owner:${identity.nickname}`);
        }
        const member = message.guild.member(identity.userId);
        return member.setNickname(identity.nickname, `Activating Identity set: ${name}`);
      });
      // TODO: This is getting stuck in the pipeline or something and not "flushing" intill activating a set with only
      // one actual "promise request" in it
      Promise.allSettled(promises)
        .then((results) => {
          const resultOutputs = results.map((result) => {
            if (result.status === 'rejected') {
              if (result.reason instanceof DiscordAPIError && result.reason.code === 50013) {
                // Missing permissions
                const memberId = result.reason.path.split('/').pop();
                return `Failed to set nickname for ${message.guild.member(
                  memberId
                )}. Insufficent permissions`;
              }

              // attempt failed
              if (typeof result.reason === 'string' && result.reason.startsWith('owner')) {
                const [_, nickname] = result.reason.split(':');
                if (!nickname) {
                  return `Cannot set nickname of owner. ${message.guild.owner} please remove your nickname`;
                } else {
                  return `Cannot set nickname of owner. ${message.guild.owner} please set your nickname to "${nickname}"`;
                }
              }
              logger.error(
                `Unable to set nickname in \`activateset\` with reason: ${result.reason}`
              );
              return 'Unable to set nickname for unknown reason. Please contact the developer';
            } else {
              return `Set nickname for ${result.value.user.username}`;
            }
          });
          message.channel.send(
            `Set **${setName}** activated: \n${resultOutputs.join('\n')}`,
            noMentionOpts
          );
        })
        .catch((err) => console.error('not sure why this happened', err));
      return;
    } catch (err) {
      throw err;
    }
  },
};
