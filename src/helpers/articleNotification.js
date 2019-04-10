import 'dotenv/config';
import emailSender from './emailSender';
import templates from './Templates';
import db from '../models';

/**
 * sends an email to each of the author's followers
 * @param {object} article
 * @param {String} userId
 * @returns { void } void
 */
const articleNotifications = async (article, userId) => {
  const url = `${process.env.BASE_URL}/api/v1/articles/${article.id}`;
  try {
    const followers = await db.followings.findAll({
      raw: true,
      where: { authorId: userId },
      attributes: ['followerId'],
      include: [{
        model: db.users,
        as: 'follower',
        attributes: ['email'],
        where: { notification: true }
      },
      {
        model: db.users,
        as: 'author',
        attributes: ['email', 'firstname'],
      }]
    });
    followers.forEach((follower) => {
      emailSender(follower['follower.email'], 'New Article Notification', templates.articleNotify(article, url, follower['author.firstname']));
    });
  } catch (error) {
    return error;
  }
};

export default articleNotifications;
