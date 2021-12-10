// SPDX-License-Identifier: MIT

import { AuthService, VehicleService } from '../services';
import config from '../config';

class VehicleController {

  constructor() {
    console.log('Initialized VehicleController');
    this.authService = new AuthService(config.auth);
    this.vehicleService = new VehicleService(config.vehicle);
  }

  getDashboardData = async ({ params = {}, headers = {} }, res, next) => {
    try {
      const { vehicleId } = params;
      const { 'x-authorization-code': code } = headers;

      console.log(`Received request to fetch vehicle dashboard data for VIN ${vehicleId} with code ${code}`);

      const accessToken = await this.authService.getAccessToken(code);
      const responseBody = await this.vehicleService.getVehicleData(vehicleId, accessToken);

      res.status(200);
      res.json(responseBody);
      
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default VehicleController;
