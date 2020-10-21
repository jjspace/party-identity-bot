//@ts-check
/**
 * Convert a command to it's help string
 * @param {import('./index').Command} command
 */
const cmdString = ({ name, usage, description, inhibitors }) =>
  `**\`${name}\`${inhibitors ? '*' : ''}** ${usage ? ` - \`${usage}\`` : ''}\n${description || ''}`;

/**
 * Generates a help command based on a collection of commands dynamically showing
 * usage examples and descriptions.
 * @param {import('discord.js').Collection<string, import('./index').Command>} commands list of commands to generate help text from
 * @returns {import('./index').Command}
 */
module.exports = (commands) => {
  let fullHelpText = '**`help`**\nDisplay this help page\n';
  fullHelpText += commands
    .filter((cmd) => !cmd.hidden)
    .map(cmdString)
    .join('\n');

  let hasInhibitedCmds = commands.find((cmd) => !!cmd.inhibitors);

  return {
    name: 'help',
    description: 'Displays help for all commands or a specific command',
    usage: 'help [?command]',
    arguments: { max: 1 },
    execute(message, args) {
      let helpText = fullHelpText;
      if (hasInhibitedCmds) {
        helpText += '\nCommands marked with `*` may have restricted use';
      }

      const targetCmd = args.shift();
      if (targetCmd) {
        const command = commands.get(targetCmd);
        if (!command || (command && command.hidden)) {
          helpText = 'Unrecognized command';
        } else {
          helpText = cmdString(command);
          if (command.inhibitors) {
            helpText += '\nThis command may have restricted use';
          }
        }
      }

      message.channel.send(helpText);
    },
  };
};
