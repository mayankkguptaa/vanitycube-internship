'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserCourse = mongoose.model('UserCourse'),
  Material = mongoose.model('Material'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a new course for the user
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var userCourse = new UserCourse(req.body);
  userCourse.user = req.user._id;

  userCourse.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userCourse);
    }
  });
};

/**
 * Get the user course for an id
 * @param req
 * @param res
 */
exports.read = function (req, res) {
  // Convert mongoose document to json
  var userCourse = req.userCourse ? req.userCourse.toJSON() : {};

  userCourse.isCurrentUserOwner = !!(req.user && userCourse.user && userCourse.user._id.toString() === req.user._id.toString());
  res.json(userCourse);
};

/**
 * List all the user courses
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  UserCourse.find({ user: req.user.id }).sort('-created').populate('user', 'categories').exec(function (err, userCourses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userCourses);
    }
  });
};

/**
 * Get the user-course by id
 * @param req
 * @param res
 * @param next
 * @param id
 * @returns {*}
 */
exports.userCourseByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'UserCourse is invalid'
    });
  }

  UserCourse.findById(id).populate('user', 'categories').exec(function (err, userCourse) {
    if (err) {
      return next(err);
    } else if (!userCourse) {
      return res.status(404).send({
        message: 'No course with that identifier has been found'
      });
    }
    req.userCourse = userCourse;
    next();
  });
};
