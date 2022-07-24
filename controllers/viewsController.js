const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.detailTour = async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // console.info(tour);
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
};

exports.loginUser = async (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};
