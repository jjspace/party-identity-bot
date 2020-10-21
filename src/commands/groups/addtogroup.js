//@ts-check

/** @type {import('../index').Command} */
module.exports = {
  name: 'addtogroup',
  description: 'Add a user to an existing group',
  usage: 'addtogroup [@mention] [group name]',
  execute: (message) => {
    message.channel.send('Not implemented yet');
  },
};
