import db from '../../../models/index';

const { user, articles, Sequelize } = db;
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
const searchArticles = async ({ body }, res) => {
  try {
    const tags = body.tags ? {
      tagList: {
        [Op.overlap]: body.tags,
      }
    } : {};

    const keyword = body.keyword ? {
      slug: {
        [Op.iLike]: {
          [Op.any]: convertToArray(body.keyword)
        }
      }
    } : {};

    const attributes = ['email', 'bio', 'image'];

    const author = body.author ? {
      include: {
        model: user,
        as: 'userId',
        attributes,
        where: {
          [Op.or]: [
            {
              first_name: {
                [Op.iLike]: {
                  [Op.any]: convertToArray(body.author)
                }
              },
            },
            {
              last_name: {
                [Op.iLike]: {
                  [Op.any]: convertToArray(body.author)
                }
              }
            }
          ]
        }
      }
    } : {};

    const searchResults = await articles.findAll({
      include: { attributes, model: user },
      ...author,
      where: {
        ...tags,
        ...keyword,
      }
    });

    res.status(200).send({ status: 200, parameters: body, data: searchResults });
  } catch (error) {
    res.status(500).send('something really bad happened');
  }
};

export default searchArticles;
