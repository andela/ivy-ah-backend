const authorizeAdmin = (request, response, next) => {
  if (request.user.role === 'admin') {
    return next();
  }
  return response.status(401).json({
    status: 401,
    error: 'Access Denied. Accessible By Admin Only'
  });
};

export default authorizeAdmin;
