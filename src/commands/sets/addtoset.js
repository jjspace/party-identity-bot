//@ts-check

/** @type {import('../index').Command} */
module.exports = {
  name: 'addtoset',
  description: 'Add a user to an existing identity set',
  usage: 'addtoset [@mention] [set name]',
  execute: (message) => {
    message.channel.send('Not implemented yet');
  },
};
