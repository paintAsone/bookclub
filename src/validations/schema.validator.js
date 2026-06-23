const property = {
  BODY: 'body',
  QUERY: 'query',
  PARAMS: 'params',
  HEADERS: 'headers',
  USERINFO: 'userInfo'
};

const validation = (schema, prop = property.BODY) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[prop]);
    if (error) {
      if (error.details[0].type === 'any.required') {
        return res.status(400).json({
                status: 40001,
                message: error.details[0].message
            });
      } else {
        return res.status(400).json({
                status: 40002,
                message: error.details[0].message
            });
      }
    } else {
      next();
    }
  };
};

export {property, validation}  