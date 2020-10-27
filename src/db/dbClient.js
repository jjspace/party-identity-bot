const logger = require('../logger');
const { Group, GroupMember, IdentitySet, Identity, Guilds } = require('./db');

const defaultPrefix = '!';

// #region helpers ======================= Helpers =======================

/**
 * @typedef NickMapping
 * @property {string} id Discord User Id
 * @property {string?} nickname Nickname for this user
 */
/**
 * Extract the ids and nicknames for a list of mentioned users
 * @param {Discord.Guild} guild discord guild to pull the nickname from
 * @param {Discord.Collection<string, Discord.User>} mentions Collection of user objects. Can get from `message.mentions.users`
 * @returns {NickMapping[]}
 */
module.exports.nicksFromMentions = (guild, mentions) =>
  mentions.array().map((user) => {
    const member = guild.member(user);
    return {
      id: user.id,
      nickname: member.nickname,
    };
  });

/**
 * Extract nicknames for a set of userIds
 * @param {Discord.Guild} guild Discord Guild to pull the nickname from
 * @param {Discord.UserResolvable} userIds List of Discord user ids
 * @returns {NickMapping[]}
 */
module.exports.nicksFromIds = (guild, userIds) =>
  userIds.map((id) => {
    const member = guild.member(id);
    return {
      id,
      nickname: member.nickname,
    };
  });

// #endregion helpers

// #region guilds ======================= Guilds =======================

/**
 * Retrieve a guild from the db
 * @async
 * @param {string} serverId
 * @return {import('./db').Guilds}
 */
module.exports.getServer = async (serverId) => {
  const server = await Guilds.findOne({ where: { guildId: serverId } });
  return server ? server.get() : undefined;
};

/**
 * Create a guild in our database with default settings
 * @param {string} serverId
 * @param {string} serverName
 */
module.exports.addServer = async (serverId, serverName) => {
  try {
    await Guilds.create({
      guildId: serverId,
      name: serverName,
      prefix: defaultPrefix,
    });
  } catch (err) {
    logger.error(err);
  }
};

// #endregion guilds

// #region groups ======================= Groups =======================

/**
 * Retrieve all groups for the current guild
 * @async
 * @param {string} guildId Guild id
 * @returns {Promise<import('./db').Group[]>}
 */
module.exports.getGroups = async (guildId, includeMembers = false) => {
  try {
    if (includeMembers) {
      return await Group.findAll({
        where: { guildId },
        include: { model: GroupMember, as: 'members' },
      });
    }
    return await Group.findAll({ where: { guildId } });
  } catch (err) {
    logger.error(err);
    // TODO: better error handler
    return null;
  }
};

/**
 * Retrieve a group in the database by name
 * @async
 * @param {string} guildId Guild id
 * @param {string} groupName requested group name
 * @returns {Promise<import('./db').Group>}
 */
module.exports.getGroup = async (guildId, groupName, includeMembers = false) => {
  try {
    if (includeMembers) {
      return await Group.findOne({
        where: { guildId, name: groupName },
        include: { model: GroupMember, as: 'members' },
      });
    }
    return await Group.findOne({ where: { guildId, name: groupName } });
  } catch (err) {
    logger.error(err);
    // TODO: better error handler
    return null;
  }
};

/**
 * Create a new group in the current guild with the specified name and add members to it if provided
 * @async
 * @param {string} guildId Guild id
 * @param {string} groupName name of group to create
 * @param {import('discord.js').GuildMemberResolvable[]} [members] array of members to add
 * @returns {Promise<import('./db').Group>}
 */
module.exports.createGroup = async (guildId, groupName, members) => {
  try {
    const newGroup = await Group.create({
      guildId,
      name: groupName,
    });

    if (members && members.length) {
      const newMembers = await GroupMember.bulkCreate(
        members.map((member) => ({
          groupId: newGroup.id,
          userId: member,
        }))
      );
      logger.info(`Added ${newMembers.length} to group ${newGroup.name}[${newGroup.id}]`);
    }

    return newGroup;
  } catch (err) {
    logger.error(err);
  }
};

/**
 * Delete a group in the current guild. Returns the number of rows deleted
 * @async
 * @param {string} guildId Guild id
 * @param {string} groupName name of group to delete
 * @returns {Promise<number>} Number of rows deleted
 */
module.exports.deleteGroup = async (guildId, groupName) => {
  try {
    return await Group.destroy({ where: { guildId, name: groupName } });
  } catch (err) {
    logger.error(err);
  }
};

// #endregion groups

// #region group-member ======================= Group Memebers =======================

/**
 * Create an Group Member within a specified group
 * @async
 * @param {number} groupId Id of the group this belongs to
 * @param {string} userId Discord user id
 * @returns {Promise<import('./db').GroupMember>}
 */
module.exports.createGroupMember = async (groupId, userId) => {
  try {
    return await GroupMember.create({
      groupId,
      userId,
    });
  } catch (err) {
    logger.warn(err);
    throw err;
  }
};

/**
 * Remove a user's identity from a given group
 * @async
 * @param {number} groupId group id
 * @param {string} userId Discord User Id
 * @returns {Promise<number>} Number of rows deleted
 */
module.exports.deleteGroupMember = async (groupId, userId) => {
  try {
    return await GroupMember.destroy({ where: { groupId, userId } });
  } catch (err) {
    logger.warn(err);
    throw err;
  }
};

// #endregion group-member

// #region sets ======================= Sets =======================

/**
 * Retrieve all sets for the current guild
 * @async
 * @param {string} guildId Guild id
 * @returns {Promise<import('./db').IdentitySet[]>}
 */
module.exports.getSets = async (guildId, includeMembers = false) => {
  try {
    if (includeMembers) {
      return await IdentitySet.findAll({
        where: { guildId },
        include: { model: Identity, as: 'identities' },
      });
    }
    return await IdentitySet.findAll({ where: { guildId } });
  } catch (err) {
    logger.error(err);
    // TODO: better error handler
    return null;
  }
};

/**
 * Retrieve a set in the database by name
 * @async
 * @param {string} guildId Guild id
 * @param {string} setName requested set name
 * @returns {Promise<import('./db').IdentitySet>}
 */
module.exports.getSet = async (guildId, setName, includeMembers = false) => {
  try {
    if (includeMembers) {
      return await IdentitySet.findOne({
        where: { guildId, name: setName },
        include: { model: Identity, as: 'identities' },
      });
    }
    return await IdentitySet.findOne({ where: { guildId, name: setName } });
  } catch (err) {
    logger.error(err);
    // TODO: better error handler
    return null;
  }
};

/**
 * Create a new set in the current guild with the specified name
 * and add member identities to it if provided
 * @async
 * @param {string} guildId Guild id
 * @param {string} setName name of group to create
 * @param {NickMapping[]} [nicknames] array of members to add
 * @returns {Promise<import('./db').IdentitySet>}
 */
module.exports.createSet = async (guildId, setName, nicknames) => {
  try {
    const newSet = await IdentitySet.create({
      guildId,
      name: setName,
    });

    if (nicknames && nicknames.length) {
      const newIdentities = await Identity.bulkCreate(
        nicknames.map((nickMap) => ({
          identitySetId: newSet.id,
          userId: nickMap.id,
          nickname: nickMap.nickname,
        }))
      );
      logger.info(`Added ${newIdentities.length} to set ${newSet.name}[${newSet.id}]`);
    }

    return newSet;
  } catch (err) {
    logger.error(err);
  }
};

/**
 * Delete a set in the current guild. Returns the number of rows deleted
 * @async
 * @param {string} guildId Guild id
 * @param {string} setName name of set to delete
 * @returns {Promise<number>} Number of rows deleted
 */
module.exports.deleteSet = async (guildId, setName) => {
  try {
    return await IdentitySet.destroy({ where: { guildId, name: setName } });
  } catch (err) {
    logger.error(err);
  }
};

// #endregion sets

// #region ids ======================= Identities =======================

/**
 * Create an Identity within a specified set
 * @async
 * @param {number} identitySetId Id of set this belongs to
 * @param {string} userId Discord user id
 * @param {string} nickname nickname used for this set
 * @returns {Promise<import('./db').Identity>}
 */
module.exports.createIdentity = async (identitySetId, userId, nickname) => {
  try {
    return await Identity.create({
      identitySetId,
      userId,
      nickname,
    });
  } catch (err) {
    logger.warn(err);
    throw err;
  }
};

/**
 * Update a user's identity for a given set
 * @param {number} identitySetId Set id
 * @param {string} userId Discord User Id
 * @param {string} newNickname new nickname for identity
 * @returns {Promise<Identity>}
 */
module.exports.updateIdentity = async (identitySetId, userId, newNickname) => {
  try {
    return await Identity.update({ nickname: newNickname }, { where: { identitySetId, userId } });
  } catch (err) {
    logger.warn(err);
    throw err;
  }
};

/**
 * Remove a user's identity from a given set
 * @async
 * @param {number} identitySetId set id
 * @param {string} userId Discord User Id
 * @returns {Promise<number>} Number of rows deleted
 */
module.exports.deleteIdentity = async (identitySetId, userId) => {
  try {
    return await Identity.destroy({ where: { identitySetId, userId } });
  } catch (err) {
    logger.warn(err);
    throw err;
  }
};

// #endregion
