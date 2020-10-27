const Discord = require('discord.js');
const ping = require('./ping');
const helpGen = require('./help');
const version = require('./version');
const groups = require('./groups/groups');
const createGroup = require('./groups/creategroup');
const delGroup = require('./groups/delgroup');
const addToGroup = require('./groups/addtogroup');
const removeFromGroup = require('./groups/removefromgroup');
const sets = require('./sets/sets');
const createSet = require('./sets/createset');
const delSet = require('./sets/delset');
const addToSet = require('./sets/addtoset');
const createSetFromGroup = require('./sets/createsetfromgroup');
const removeFromSet = require('./sets/removefromset');
const updateSet = require('./sets/updateset');
const updateSelfInSet = require('./sets/updateselfinset');
const activateSet = require('./sets/activateset');

/**
 * @type {Discord.Collection<string, Command>}
 */
const commands = new Discord.Collection();

/**
 * @callback CommandHandler
 * @param {Discord.Message} message Full message contents
 * @param {string[]} [args] Command argument array
 */

/**
 * @typedef Command Defines a command and how it should be handled
 * @property {string} name command name used to activate
 * @property {string} [description] Command description used for help display
 * @property {string} [usage] - usage example shown in help page
 * @property {import('../utils').argOpts} [arguments] argument requirements
 * @property {boolean} [hidden]: hides command from help command if true
 * @property {import('../inhibitors/index').Inhibitor[]} [inhibitors]: [botDev],
 * @property {CommandHandler} execute Called to execute the command. Message and args will be passed in
 */

/**
 * Register a command in the command collection. Commands should not have duplicate `name`s
 * @param {Command} command
 */
const registerCommand = (command) => {
  commands.set(command.name, command);
};

// TODO: implement automatic command importing
// const commandFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith('.js'));
// commandFiles.forEach((file) => {
//   if (file === path.basename(__filename)) return; // ignore this index file
//   if (file === 'help.js') return; // ignore the help file
//   const command = require(path.join(__dirname, file));
//   registerCommand(command);
// });

registerCommand(ping);
registerCommand(version);
registerCommand(groups);
registerCommand(createGroup);
registerCommand(delGroup);
registerCommand(addToGroup);
registerCommand(removeFromGroup);
registerCommand(sets);
registerCommand(createSet);
registerCommand(delSet);
registerCommand(addToSet);
registerCommand(createSetFromGroup);
registerCommand(removeFromSet);
registerCommand(updateSet);
registerCommand(updateSelfInSet);
registerCommand(activateSet);

// Generate help command from command definitions
const help = helpGen(commands);
commands.set(help.name, help);

module.exports = commands;
