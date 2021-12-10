// SPDX-License-Identifier: MIT

import createHttpError from 'http-errors';
import ApiAdapters from './apiAdapters';

/**
 * This service fetches vehicle data from the Mercedes-Benz APIs
 * and prepares an aggregated response.
 */
class VehicleService {

  constructor(config) {
    this.apiKey = config.apiKey;
    this.apiAdapters = Object.keys(ApiAdapters).reduce((acc, key) => {
      acc[key] = new ApiAdapters[key](config.adapters[key]);
      return acc;
    }, {});

    console.log('Instantiated VehicleService');
  }

  /**
   * Retrieves vehicle-related data from the Electric Vehicle Status API and the Fuel Status API (BYOCAR),
   * as well as images from the Vehicle Images API.
   * The returned data is combined in an aggregated response format.
   * 
   * @param {*} vehicleId the vehicle ID
   * @param {*} accessToken the OAuth 2.0 access token required to call BYOCAR APIs
   * @returns the aggregated vehicle data for the dashboard
   */
  async getVehicleData(vehicleId, accessToken) {
    if (!vehicleId) {
      throw createHttpError.BadRequest('No vehicle ID provided');
    }

    const adapterResponses = await Promise.all(Object.values(this.apiAdapters).map(async adapter => adapter.fetch({ vehicleId, accessToken })));
    const result = adapterResponses.filter(data => Object.keys(data).length > 0).reduce((acc, item) => ({ ...acc, ...item }), {});
    
    if (Object.keys(result).filter((key = '') => key.indexOf('Error') < 0).length === 0) {
      throw createHttpError.InternalServerError(`Did not get any data for VIN ${vehicleId}`);
    }

    return result;
  }
};

export default VehicleService;
