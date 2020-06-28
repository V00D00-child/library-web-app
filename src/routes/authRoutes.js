/* eslint-disable padded-blocks */
const express = require('express');
const passport = require('passport');

const authRouter = express.Router();
const authController = require('../controller/authController');

function router(nav) {
  const {
    nextUserIdMiddleware,
    createUser,
    getSignIn,
    profileMiddleware,
    getProfile,
    getLogout,
  } = authController(nav);

  authRouter.route('/signup')
    .all(nextUserIdMiddleware)
    .post(createUser);

  authRouter.route('/signin')
    .get(getSignIn)
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    }));

  authRouter.route('/profile')
    .all(profileMiddleware)
    .get(getProfile);

  authRouter.route('/logout')
    .get(getLogout);

  return authRouter;

}


module.exports = router;
