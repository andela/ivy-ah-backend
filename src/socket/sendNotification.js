import joi from 'joi';
import db from '../models';
import { io } from './socket';
import Notifications from '../routes/api/notifications/notificationsController';

/**
 * sends real time notification to article author
 * @param {object} comment new comment
 * @returns {void} void
 */
const sendCommentNotification = async (comment) => {
  const article = await db.articles.findByPk(comment.articleId);
  if (article.author !== comment.author) {
    io.to(article.author).emit('comment', { ...article.dataValues, comment });
  }

  if (!comment.parentTracker) { return; }

  const replied = await db.comment.findByPk(comment.parentTracker);
  if (replied.author !== comment.author) {
    io.to(replied.author).emit('comment reply', { ...replied.dataValues, reply: comment });
  }
};

const sendArticleNotification = async (article) => {
  io.emit('new article', article);
};

/**
 * sends real time notification to article author
 * @param {object} like like object
 * @returns {void} void
 */
const sendLikeNotification = async (like) => {
  if (like.option === null) { return; }
  const article = await db.articles.findByPk(like.articleId);
  if (article.author !== like.userId) {
    io.to(article.author).emit('article like', { ...article.dataValues, [like.option ? 'like' : 'dislike']: like });
  }
};

/**
 * sends real time notification to comment author
 * @param {object} like like object
 * @returns {void} void
 */
const sendCommentLikeNotification = async (like) => {
  if (like.option === null) { return; }
  const comment = await db.comment.findByPk(like.commentId);
  if (comment.author !== like.userId) {
    io.to(comment.author).emit('comment like', { ...comment.dataValues, [like.option ? 'like' : 'dislike']: like });
  }
};

/**
 * sends real time notification to user
 * @param {object} data
 * @param {String} action user action (like || dislike)
 * @returns {void} void
 */
const sendFollowingNotification = async (data, action) => {
  io.to(data.followerId).emit('follow', { ...data, action });
};

io.use((socket, next) => {
  socket.on('get comments', async () => {
    let comments;
    try {
      comments = await Notifications.commentNotifications(socket.id);
    } catch (error) {
      comments = { error: 'internal server error' };
    }
    socket.emit('comment', comments);
  });

  socket.on('clear notifications', async (id) => {
    try {
      if (id) {
        await joi.validate(id, joi.string().uuid());
        await Notifications.clear({ author: socket.id, id });
      } else {
        await Notifications.clear({ author: socket.id });
      }
      socket.emit('clear notifications', 'notifications cleared');
    } catch (error) {
      if (error.isJoi) {
        return socket.emit('clear notifications', 'uuid format incorrect');
      }
      socket.emit('clear notifications', 'server error');
    }
  });
  next();
});

export {
  sendCommentNotification,
  sendLikeNotification,
  sendFollowingNotification,
  sendCommentLikeNotification,
  sendArticleNotification
};
