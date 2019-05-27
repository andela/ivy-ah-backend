import db from '../../../models/index';

const { users, articles, Sequelize } = db;
const { Op } = Sequelize;
/**
 * converts a string into an array of words
 * @param {String} string string to be converted
 * @return {String[]} array of words extracted
 */
const convertToArray = string => string.match(/\w+/g).map(str => `%${str}%`);

/**
 * searches for articles using provided parameters *
 * @param {Request} { body } request body
 * @param {Response} res respont object
 * @returns {Void} void
 */
const searchArticles = async ({ query }, res) => {
  try {
    const tags = query.tags ? {
      tagList: {
        [Op.overlap]: query.tags,
      }
    } : {};

    const keyword = query.keyword ? {
      slug: {
        [Op.iLike]: {
          [Op.any]: convertToArray(query.keyword)
        }
      }
    } : {};

    const attributes = ['email', 'bio', 'image'];

    const author = query.author ? {
      include: {
        model: users,
        as: 'userId',
        attributes,
        where: {
          [Op.or]: [
            {
              first_name: {
                [Op.iLike]: {
                  [Op.any]: convertToArray(query.author)
                }
              },
            },
            {
              last_name: {
                [Op.iLike]: {
                  [Op.any]: convertToArray(query.author)
                }
              }
            }
          ]
        }
      }
    } : {};

    const searchResults = await articles.findAll({
      include: { attributes, model: users },
      ...author,
      where: {
        ...tags,
        ...keyword,
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).send({ status: 200, parameters: query, data: searchResults });
  } catch (error) {
    res.status(500).send('something really bad happened');
  }
};

export default searchArticles;
