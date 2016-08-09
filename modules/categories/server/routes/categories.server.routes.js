'use strict';

/**
 * Module dependencies
 */
var categoriesPolicy = require('../policies/categories.server.policy'),
  categories = require('../controllers/categories.server.controller');

module.exports = function (app) {
  // Categories collection routes
  app.route('/api/categories').all(categoriesPolicy.isAllowed)
    .get(categories.list)
    .post(categories.create);

  app.route('/api/categories/:categoryId/materials').all(categoriesPolicy.isAllowed)
    .get(categories.materialList);

  // Single article routes
  app.route('/api/categories/:categoryId').all(categoriesPolicy.isAllowed)
    .get(categories.read)
    .put(categories.update)
    .delete(categories.delete);

  // Finish by binding the article middleware
  app.param('categoryId', categories.categoryByID);
};
