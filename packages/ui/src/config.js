// SPDX-License-Identifier: MIT

const { VUE_APP_CLIENT_ID = '<YOUR CLIENT ID>' } = process.env;

export const config = {
  OAUTH_URL: "https://id.mercedes-benz.com/as/authorization.oauth2",
  CLIENT_ID: VUE_APP_CLIENT_ID,
  REDIRECT_URI: "http://localhost:8080/",
  SCOPE: "mb:vehicle:mbdata:fuelstatus mb:vehicle:mbdata:evstatus",
  API_URL: "http://localhost:3000/api",
};
