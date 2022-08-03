const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const reviewRoute = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],

      baseUri: ["'self'"],

      fontSrc: ["'self'", 'https:', 'data:'],

      scriptSrc: [
        "'self'",
        'http:',
        'https://*.cloudflare.com',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'data:',
      ],

      frameSrc: ["'self'", 'https://*.stripe.com'],

      objectSrc: ["'none'"],
      // styleSrc: ["'self'", 'https:', 'unsafe-inline'],

      workerSrc: ["'self'", 'data:', 'blob:'],

      childSrc: ["'self'", 'blob:'],

      imgSrc: ["'self'", 'data:', 'blob:'],

      connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],

      upgradeInsecureRequests: [],
    },
  })
);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//* Global MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// code dibawah, view static file
// app.use(express.static(`${__dirname}/public/`));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//body parser, reading data from body into req.body
app.use(bodyParser.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'difficulty',
      'ratingQuantity',
      'price',
      'maxGroupSize',
      'ratingsAverage',
      'duration',
    ],
  })
);

//rate limit settings
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests form thi ip, please try again in an hour',
});

app.use('/api', limiter);
//test middleware
app.use(compression());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.info(req.cookies);
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours/', tourRoute);
app.use('/api/v1/users/', userRoute);
app.use('/api/v1/reviews/', reviewRoute);
app.use('/api/v1/booking/', bookingRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
