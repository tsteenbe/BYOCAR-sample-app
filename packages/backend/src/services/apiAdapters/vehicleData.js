// SPDX-License-Identifier: MIT

import axios from 'axios';
import createHttpError from 'http-errors';

/**
 * This adapter retrieves the data from the vehicle data APIs which are BYOCAR APIs.
 * It uses the URL and endpoints defined in the configuration to retrieve the data.
 */
class VehicleDataAdapter {

  API_URL = 'https://api.mercedes-benz.com/vehicledata/v2';

  constructor(config) {
    this.tryout = config.tryout;
    this.url = this.tryout ? this.API_URL.replace('vehicledata', 'vehicledata_tryout') : this.API_URL;
    this.apis = config.apis;

    console.log('Instantiated VehicleDataAdapter');
  }

  /**
   * Fetches and aggregates data from the configured API endpoints.
   * If an API request fails, the data from that API is omitted in the result.
   * 
   * @param {*} the parameter object defining `vehicleId` and `accessToken` 
   * @returns the aggregated vehicle data
   */
  async fetch({ vehicleId, accessToken } = {}) {
    const results = await Promise.all(this.apis.map(async ({ path, tryoutToken }) => this.getContainerResponse(path, vehicleId, this.tryout ? tryoutToken : accessToken )));
    const vehicleData = results.reduce((acc, container) => ({ ...acc, ...containerToObject(container) }), {});

    console.log(`Retrieved vehicle data for vehicle ID ${vehicleId}`, vehicleData);

    return vehicleData;
  }

  /**
   * Fetches the container response from vehicle data APIs.
   * If a request fails, errors are only logged so that the data is
   * omitted in the eventual response but does not fail the request.
   * Besides that, error information are added to the result object.
   * 
   * @param {*} endpoint the vehicle data endpoint
   * @param {*} vehicleId the vehicle ID
   * @param {*} accessToken the access token
   * @returns the container response as documented in the Mercedes-Benz API specification
   */
  async getContainerResponse(endpoint, vehicleId, accessToken) {
    console.log(`Getting vehicle data from ${endpoint} for vehicle ID ${vehicleId}...`);

    try {
      const { data = [] } = await axios.get(`${this.url}/vehicles/${vehicleId}/containers/${endpoint}`, { headers: {
        Authorization: `Bearer ${accessToken}`
      }});

      return data;
    } catch (err) {
      const { response = {} } = err;
      const { status, statusText, data: responseBody } = response;
      console.warn(`Retrieving fuel status for VIN ${vehicleId} failed with ${status} ${statusText}:`, responseBody);

      if (status === 401) {
        throw createHttpError.Unauthorized('Authentication for BYOCAR failed');
      }

      const error = {};
      error[`${endpoint}Error`] = { status, errorDetails: responseBody };

      return [error];
    }
  }
};

const containerToObject = (container = []) => {
  return container.reduce((acc, item) => {
    const key = Object.keys(item)[0];
    const value = item[key].value;

    acc[key] = value ? parseInt(value) | value : item[key];

    return acc;
  }, {});
}

export default VehicleDataAdapter;
