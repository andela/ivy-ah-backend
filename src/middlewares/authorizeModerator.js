const authorizeModerator = (request, response, next) => {
  if (request.user.role === 'moderator' || request.user.role === 'admin') {
    return next();
  }
  return response.status(401).json({
    status: 401,
    error: 'Access Denied. Accessible By Moderator And Admin Only'
  });
};

export default authorizeModerator;
