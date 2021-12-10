// SPDX-License-Identifier: MIT

import express from 'express';
import cors from 'cors';
import routes from './routes';
import config from './config';
import { logErrors, errorHandler } from './errorHandlers';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/api', routes);

app.use(logErrors);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server started on port ${config.PORT}!`);
});

export default app;
