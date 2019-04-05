import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import multer from 'multer';
import router from './routes/api/index';

config();

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer().any());

app.use('/api/v1', router);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));
// finally, let's start our server...
app.listen(process.env.PORT || 3000);
