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

const article = joi.object().keys({
  title: joi.string().required().error(() => 'Title is required'),
  description: joi.string().required().error(() => 'description is required'),
  body: joi.string().required().error(() => 'Body is required'),
  author: joi.string().required().error(() => 'Author is required'),
  tagList: joi.array().optional().error(() => 'tagList must be an array '),
  rawtext: joi.string().optional().error(() => 'Please enter string for rawtext')
});

const rating = joi.object().keys({
  article: joi.string().required().error(() => 'article is required'),
  user: joi.string().required().error(() => 'user is required'),
  rate: joi.number().integer().max(5).min(0)
    .error(() => 'rating cannot be more than 5')
    .required()
    .error(() => 'rating is required but cannot less than 0 or more than 5'),
});

const schemas = {
  userLogin: joi.object().keys({ email, password }),
  userSignup: joi.object().keys({ username, email, password }),
  articles: joi.object().keys({ article }),
  rating: joi.object().keys({ rating }),
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
        obj[context.key] = message.replace(/"/g, '');
      });
      rej(obj);
    });
});

export default validator;
