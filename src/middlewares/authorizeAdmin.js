const authorizeAdmin = (request, response, next) => {
  if (request.user.role === 'admin') {
    return next();
  }
  return response.status(401).json({
    status: 401,
    error: 'Access Denied. You are not authorized to access this resource'
  });
};

export default authorizeAdmin;
