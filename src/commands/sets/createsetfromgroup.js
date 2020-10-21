//@ts-check

/** @type {import('../index').Command} */
module.exports = {
  name: 'createsetfromgroup',
  description: 'Add a user to an existing identity set',
  usage: 'creatsetfromgroup [group name]',
  execute: (message) => {
    message.channel.send('Not implemented yet');
  },
};
