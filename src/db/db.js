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
 * @property {number} id database id of this group
 * @property {string} guildId Guild id this group belongs to
 * @property {string} name name of the group
 * @property {GroupMember[]} [members] list of group members
 */
const Group = sequelize.define('group', {
  guildId: { type: DataTypes.STRING, allowNull: false, unique: 'noDupeGroups' },
  name: { type: DataTypes.TEXT, allowNull: false, unique: 'noDupeGroups' },
});
/**
 * @typedef GroupMember
 * @property {string} groupId group id this member belongs to
 * @property {import('discord.js').GuildMemberResolvable} userId discord user id of this group member
 */
const GroupMember = sequelize.define('group-member', {
  groupId: { type: DataTypes.STRING, allowNull: false, references: { model: Group, key: 'id' } },
  userId: { type: DataTypes.STRING, allowNull: false },
});
Group.hasMany(GroupMember, { as: 'members', onDelete: 'cascade' });
GroupMember.belongsTo(Group);

/**
 * @typedef IdentitySet
 * @property {number} id Unique Identity Set id
 * @property {string} guildId Guild id this set belongs to
 * @property {string} name name of the set
 * @property {Identity[]} [identities] list of identities in this set
 */
const IdentitySet = sequelize.define('identity-set', {
  guildId: { type: DataTypes.STRING, allowNull: false, unique: 'noDupeSets' },
  name: { type: DataTypes.TEXT, allowNull: false, unique: 'noDupeSets' },
});
/**
 * @typedef Identity Represents an identity of a user when using a set of identities
 * @property {string} identitySetId Set id this identity belongs to
 * @property {string} userId discord user id for this identity
 * @property {string} nickname nickname when using this identity
 */
const Identity = sequelize.define('identity', {
  identitySetId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'noDupeIdentitiesInSet',
    references: { model: IdentitySet, key: 'id' },
  },
  userId: { type: DataTypes.STRING, allowNull: false, unique: 'noDupeIdentitiesInSet' },
  nickname: { type: DataTypes.TEXT },
});
IdentitySet.hasMany(Identity, { as: 'identities', onDelete: 'cascade' });
Identity.belongsTo(IdentitySet);

sequelize.sync();

module.exports = {
  Guilds,
  Group,
  GroupMember,
  IdentitySet,
  Identity,
};
