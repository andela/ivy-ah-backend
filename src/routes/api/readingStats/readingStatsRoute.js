import express from 'express';
import readingStatistics from './readingStatistics';
import checkToken from '../../../middlewares/authorization';
import validate from '../../../middlewares/validator/index';

const { getReadingStats } = readingStatistics;

const readingStatsRouter = express.Router();

readingStatsRouter.get('/:timeline', validate.validateTimeline, checkToken, getReadingStats);

export default readingStatsRouter;
