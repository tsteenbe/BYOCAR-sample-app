// SPDX-License-Identifier: MIT

const {
  PORT = 3000,
  CLIENT_ID = '<YOUR CLIENT ID>',
  CLIENT_SECRET = '<YOUR CLIENT SECRET>',
  REDIRECT_URI = 'http://localhost:8080/',
  API_KEY = '<YOUR API KEY>',
  USE_TRYOUT = 'false',
} = process.env;

const tryout = USE_TRYOUT == 'true';

const config = {
  PORT,
  auth: {
    tryout,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
  },
  vehicle: {
    adapters: {
      vehicleData: {
        apis: [
          {
            path: 'fuelstatus',
            tryoutToken: '7c7c777c-f123-4123-s123-7c7c777c7c77'
          },
          {
            path: 'electricvehicle',
            tryoutToken: '2c2c222c-e123-4123-v123-2c2c222c2c22'
          }
        ],
        tryout,
      },
      vehicleImages: {
        apiKey: API_KEY,
        tryout,
        imagePath: 'images',
        downloadHost: `http://localhost:${PORT}`
      }
    }
  }
};

export default config;
