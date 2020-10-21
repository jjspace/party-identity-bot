//@ts-check

/** @type {import('../index').Command} */
module.exports = {
  name: 'updateset',
  description: 'Update the identities for a given set using the members current nicknames',
  usage: 'updateset [set name]',
  execute: (message) => {
    message.channel.send('Not implemented yet');
  },
};
