import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.commentlikes.tableName,
    db.commentlikes.rawAttributes).then(() => {
    queryInterface.addConstraint('commentlikes', ['commentId', 'userId'], { type: 'unique', name: 'commentlikes_commentId_userId_key' });
  }),
  down: queryInterface => queryInterface.dropTable('commentlikes')
};
