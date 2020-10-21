//@ts-check

/** @type {import('../index').Command} */
module.exports = {
  name: 'updateselfinset',
  description:
    'Update your own nickname in the specified set. Uses current nickname if not specified',
  usage: 'updateselfinset [set name] [new nickname]',
  execute: (message) => {
    message.channel.send('Not implemented yet');
  },
};
