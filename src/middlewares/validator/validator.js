import joi from 'joi';

const username = joi.string().alphanum().min(3).max(10)
  .error(() => 'username must contain between 3 and 10 alphanumeric characters')
  .required();

const email = joi.string().email()
  .error(() => 'email must be in the format john@example.com')
  .required();

const password = joi.string().trim().regex(/^[\w\W]{8,32}$/)
  .error(() => 'password must contain between 8 and 32 characters')
  .required();

const resetToken = joi.string().trim().regex(/^[\w\W]+\.[\w\W]+\.[\w\W]+$/)
  .error(() => 'The password reset link has expired, kindly request for a new reset link')
  .required();

const role = joi.string().trim().required().error(() => 'Role is required');
const title = joi.string().required().error(() => 'Title is required');
const description = joi.string().required().error(() => 'description is required');
const body = joi.string().required().error(() => 'Body is required');
const tagList = joi.array().required().error(() => 'tagList must be an array ');
const plainText = joi.string().required().error(() => 'Plain text is required');

const articleId = joi.string().guid().required().error(() => 'We do not know the article you are trying to rate. Please provide a valid article id');
const rating = joi.number().integer().min(1).max(5)
  .required()
  .error(() => 'we know you really want to rate this article, but rating can only be number 1, 2, 3, 4, or 5');

const option = joi.string().required().regex(/^(like|dislike)$/).error(() => 'Options can only be like or dislike');

const keyword = joi.string()
  .error(() => 'keyword must be a string');

const tags = joi.array()
  .error(() => 'tags must be an array containing only strings');

const author = joi.string()
  .error(() => 'author must be a string');

const updateSchema = joi.object().keys({
  username: joi.string().alphanum().min(3).max(10)
    .error(() => 'username must contain between 3 and 10 alphanumeric characters'),
  firstname: joi.string().alphanum().min(3).max(225)
    .error(() => 'firstname must contain between 3 and 225 alphanumeric characters'),
  lastname: joi.string().alphanum().min(3).max(225)
    .error(() => 'lastname must contain between 3 and 225 alphanumeric characters'),
  email: joi.string().email()
    .error(() => 'email must be in the format john@example.com')
}).or('username', 'email', 'firstname', 'lastname');

const reason = joi.string()
  .error(() => 'reason must be a string').required();

const article = joi.string()
  .error(() => 'article must be a string');

const schemas = {
  userLogin: joi.object().keys({ email, password }),
  userSignup: joi.object().keys({ username, email, password }),
  articles: joi.object().keys({
    title, description, body, tagList, plainText
  }),
  forgotPassword: joi.object().keys({ email }),
  resetPassword: joi.object().keys({ password, resetToken }),
  articleSearch: joi.object().keys({ keyword, tags, author }).or(['keyword', 'tags', 'author']).error(() => 'a valid search parameter must be provided'),
  articleRating: joi.object().keys({ articleId, rating }),
  getArticleRating: joi.object().keys({ articleId }),
  updateSchema,
  validateArticleLikes: joi.object().keys({ articleId, option }),
  reportArticles: joi.object().keys({ reason, article }),
  comment: joi.object().keys({ body }),
  userRole: joi.object().keys({ role })
};

/**
 * validates an object against a joi object schema provided by the
 * schemaName parameter. It returns a promise that resolves with the
 * validated object or rejects with an error object
 * @param {Object} object object to be validated
 * @param {String} schemaName schema the object should be validated against
 * @returns {Promise} promise
 */
const validator = (object, schemaName) => new Promise((res, rej) => {
  joi.validate(object, schemas[schemaName], { abortEarly: false })
    .then(value => res(value))
    .catch(({ details }) => {
      const obj = {};
      details.forEach(({ context, message }) => {
        if (context.key) obj[context.key] = message.replace(/"/g, '');
      });
      rej(Object.keys(obj)[0] ? obj : details[0].message);
    });
});

export default validator;
