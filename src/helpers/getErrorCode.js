const getErrorCode = (err) => {
  if (err.original) {
    const { code } = err.original;
    return code;
  }
  return false;
};

export default getErrorCode;
