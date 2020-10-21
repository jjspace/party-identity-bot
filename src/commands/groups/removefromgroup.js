//@ts-check

/** @type {import('../index').Command} */
module.exports = {
  name: 'removefromgroup',
  description: 'Remove a user from an existing group',
  usage: 'removefromgroup [@mention] [group name]',
  execute: (message) => {
    message.channel.send('Not implemented yet');
  },
};
