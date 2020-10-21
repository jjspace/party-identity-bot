//@ts-check
const { developerIds } = require('../config');

/** @type {import('./index').Inhibitor} */
module.exports = function ({ author }) {
  if (developerIds.includes(author.id)) {
    return false;
  }
  return 'not-developer';
};
