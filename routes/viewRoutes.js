const express = require('express');

const {
  getOverview,
  detailTour,
  loginUser,
} = require('../controllers/viewsController');
const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/tours/:slug', detailTour);
router.get('/login', loginUser);

module.exports = router;
