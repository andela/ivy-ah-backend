import authenticator from '../helpers/authenticator';

const authorization = (req, res, next) => {
  try {
    req.user = authenticator.verifyToken(req.get('authorization'));
    next();
  } catch (error) {
    res.status(401).send('not authorized');
  }
};

export default authorization;
