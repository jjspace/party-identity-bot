const { Sequelize, DataTypes } = require('sequelize');
const { databaseFile } = require('../config');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  // logging: console.log,
  logging: false,
  // SQLite only
  storage: databaseFile,
});

/**
 * @typedef Guilds
 * @property {string} guildId discord guild id
 * @property {string} prefix prefix string
 * @property {string} name guild name
 */
const Guilds = sequelize.define('guilds', {
  guildId: {
    type: DataTypes.STRING,
    unique: true,
  },
  prefix: DataTypes.STRING,
  name: DataTypes.TEXT,
});

/**
 * @typedef Group
 * @property {string} guildId Guild id this group belongs to
 * @property {string} name name of the group
 * @property {GroupMember[]} [members] list of group members
 */
const Group = sequelize.define('group', {
  guildId: { type: DataTypes.STRING, unique: 'noDupeGroups' },
  name: { type: DataTypes.TEXT, unique: 'noDupeGroups' },
});
/**
 * @typedef GroupMember
 * @property {string} groupId group id this member belongs to
 * @property {import('discord.js').GuildMemberResolvable} userId discord user id of this group member
 */
const GroupMember = sequelize.define('group-member', {
  groupId: { type: DataTypes.STRING, references: { model: Group, key: 'id' } },
  userId: DataTypes.STRING,
});
Group.hasMany(GroupMember, { as: 'members' });
GroupMember.belongsTo(Group);

/**
 * @typedef IdentitySet
 * @property {string} guildId Guild id this set belongs to
 * @property {string} name name of the set
 * @property {Identity[]} [identities] list of identities in this set
 */
const IdentitySet = sequelize.define('identity-set', {
  guildId: { type: DataTypes.STRING, unique: 'noDupeSets' },
  name: { type: DataTypes.TEXT, unique: 'noDupeSets' },
});
/**
 * @typedef Identity Represents an identity of a user when using a set of identities
 * @property {string} identitySetId Set id this identity belongs to
 * @property {string} userId discord user id for this identity
 * @property {string} nickname nickname when using this identity
 */
const Identity = sequelize.define('identity', {
  identitySetId: { type: DataTypes.STRING, references: { model: IdentitySet, key: 'id' } },
  userId: DataTypes.STRING,
  nickname: DataTypes.TEXT,
});
IdentitySet.hasMany(Identity, { as: 'identities' });
Identity.belongsTo(IdentitySet);

sequelize.sync();

module.exports = { Guilds, Group, GroupMember, IdentitySet, Identity };
