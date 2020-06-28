const express = require('express');

const adminRouter = express.Router();
const adminController = require('../controller/adminController');

function router(nav) {
  const {
    authorization,
    getAuthMiddleware,
    getAuth,
    doCreateBook,
  } = adminController(nav);

  adminRouter.use(authorization);

  adminRouter.route('/')
    .all(getAuthMiddleware)
    .get(getAuth)
    .post(doCreateBook);


  return adminRouter;
}


module.exports = router;
