/**
 * this takes an array which contains strings,
 * checks for duplicate and return an array with unique entry
 * @param {array} array
 * @returns {array} noDuplicate
 */
const removeDuplicate = array => array.reduce((noDuplicate, current) => {
  if (!noDuplicate.includes(current.toLowerCase())) {
    noDuplicate.push(current.toLowerCase());
  }
  return noDuplicate;
}, []);

export default removeDuplicate;
