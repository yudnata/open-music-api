const routes = (handler) => {
  const router = require('express').Router();
  
  router.post('/', handler.postUserHandler);

  return router;
};

module.exports = routes;