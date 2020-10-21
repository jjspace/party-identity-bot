//@ts-check

/** @type {import('../index').Command} */
module.exports = {
  name: 'removefromset',
  description: 'Remove a user from an existing identity set',
  usage: 'removefromset [@mention] [set name]',
  execute: (message) => {
    message.channel.send('Not implemented yet');
  },
};
