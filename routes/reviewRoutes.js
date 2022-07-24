const express = require('express');

const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(restrictTo('admin', 'user'), reviewController.deleteReview)
  .patch(restrictTo('admin', 'user'), reviewController.updateReview);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

module.exports = router;
