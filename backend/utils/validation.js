const { validationResult } = require('express-validator');
const { handle } = require('express/lib/router');

// middleware for formatting errors fro express-validator  middlware
// (to customize, see experess's validator's docs)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) { 
      const errors = {};
      validationErrors
        .array()
        .forEach(error => errors[error.path] = error.msg);
  
      const err = Error("Bad request.");
      err.errors = errors;
      err.status = 400;
      err.title = "Bad request.";
      next(err);
    }
    next();
  };
  
  module.exports = {
    handleValidationErrors
  };
  