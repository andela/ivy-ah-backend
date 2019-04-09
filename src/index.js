import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import multer from 'multer';
import router from './routes/api/index';
import './config/socialAuth';

config();

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer().any());
app.use(passport.initialize());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.session());

app.use('/api/v1', router);


app.use((req, res, next) => {
  const error = new Error('Resource Not Found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500)
    .json({
      status: err.status,
      error: err.message
    });
});

app.listen(process.env.PORT || 3000);

export default app;
