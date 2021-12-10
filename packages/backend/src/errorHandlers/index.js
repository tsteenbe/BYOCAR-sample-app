// SPDX-License-Identifier: MIT

const logErrors = (err, req, res, next) => {
  console.error('An error occurred:', err);
  next(err);
}

const errorHandler = ({ status = 500, message = 'Oops! Something went wrong!' }, req, res, next) => {
  res.status(status);
  res.json({ message });
}

export { logErrors, errorHandler };
