// SPDX-License-Identifier: MIT

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import spies from 'chai-spies';
import sinon from 'sinon';
import { VehicleService } from '../../src/services';
import ApiAdapters from '../../src/services/apiAdapters';

const { vehicleData, vehicleImages } = ApiAdapters;

chai.use(spies);
chai.use(chaiAsPromised);

describe('Vehicle Service', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });

  const config = {
    adapters: {
      vehicleData: {
        url: 'http://example.com/vehicleData',
        endpoints: ['fuelstatus', 'electricvehicle']
      },
      vehicleImages: {
        url: 'http://example.com/vehicleImages',
        apiKey: 'some_api_key'
      }
    }
  };
  const service = new VehicleService(config);

  describe('getVehicleData()', () => {
    it('should throw error when called without vehicle ID', async () => {
      const vehicleId = undefined;
      const accessToken = 'some_token';

      await expect(service.getVehicleData(vehicleId, accessToken)).to.be.rejectedWith('No vehicle ID provided');
    });

    it('should throw error when no data is returned', async () => {
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      sandbox.stub(vehicleData.prototype, 'fetch').callsFake(() => ({}));
      sandbox.stub(vehicleImages.prototype, 'fetch').callsFake(() => ({}));

      await expect(service.getVehicleData(vehicleId, accessToken)).to.be.rejectedWith(`Did not get any data for VIN ${vehicleId}`);
    });

    it('should call adapters with vehicle ID and access token as parameters, and combine adapter responses to single response object', async () => {
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      sandbox.stub(vehicleData.prototype, 'fetch').callsFake(() => ({
        rangeliquid: 300,
        tanklevelpercent: 90,
        rangeelectric: 300,
        soc: 90
      }));
      sandbox.stub(vehicleImages.prototype, 'fetch').callsFake(() => ({
        imageUrls: [
          'http://localhost:3000/images/EXT10-WDD2132231A444556.png',
          'http://localhost:3000/images/INT1-WDD2132231A444556.png'
        ]
      }));

      await expect(service.getVehicleData(vehicleId, accessToken)).to.eventually.eql({
        rangeliquid: 300,
        tanklevelpercent: 90,
        rangeelectric: 300,
        soc: 90,
        imageUrls: [
          'http://localhost:3000/images/EXT10-WDD2132231A444556.png',
          'http://localhost:3000/images/INT1-WDD2132231A444556.png'
        ]
      });

      const spyVehicleDataCall = vehicleData.prototype.fetch.getCall(0);
      const spyVehicleImagesCall = vehicleImages.prototype.fetch.getCall(0);

      // assert the call with the URL
      expect(spyVehicleDataCall.calledWith({ vehicleId, accessToken })).to.be.true;
      expect(spyVehicleImagesCall.calledWith({ vehicleId, accessToken })).to.be.true;
    });

    it('should return response object if vehicle data returns error object', async () => {
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      sandbox.stub(vehicleData.prototype, 'fetch').callsFake(() => ({
        fuelstatusError: {
          status: 404,
          errorDetails: {
            exveErrorId: '104',
            exveErrorMsg: 'Not Found',
            exveErrorRef: 'd0ba84e3-6303-4e41-87d9-6adc8f4d5696'
          }
        },
        electricvehicleError: {
          status: 404,
          errorDetails: {
            exveErrorId: '104',
            exveErrorMsg: 'Not Found',
            exveErrorRef: 'd0ba84e3-6303-4e41-87d9-6adc8f4d5696'
          }
        }
      }));
      sandbox.stub(vehicleImages.prototype, 'fetch').callsFake(() => ({
        imageUrls: [
          'http://localhost:3000/images/EXT10-WDD2132231A444556.png',
          'http://localhost:3000/images/INT1-WDD2132231A444556.png'
        ]
      }));

      await expect(service.getVehicleData(vehicleId, accessToken)).to.eventually.eql({
        fuelstatusError: {
          status: 404,
          errorDetails: {
            exveErrorId: '104',
            exveErrorMsg: 'Not Found',
            exveErrorRef: 'd0ba84e3-6303-4e41-87d9-6adc8f4d5696'
          }
        },
        electricvehicleError: {
          status: 404,
          errorDetails: {
            exveErrorId: '104',
            exveErrorMsg: 'Not Found',
            exveErrorRef: 'd0ba84e3-6303-4e41-87d9-6adc8f4d5696'
          }
        },
        imageUrls: [
          'http://localhost:3000/images/EXT10-WDD2132231A444556.png',
          'http://localhost:3000/images/INT1-WDD2132231A444556.png'
        ]
      });
    });

    it('should return response without imageUrls if vehicle images returns no image URLs', async () => {
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      sandbox.stub(vehicleData.prototype, 'fetch').callsFake(() => ({
        rangeliquid: 300,
        tanklevelpercent: 90,
        rangeelectric: 300,
        soc: 90
      }));
      sandbox.stub(vehicleImages.prototype, 'fetch').callsFake(() => ({}));

      await expect(service.getVehicleData(vehicleId, accessToken)).to.eventually.eql({
        rangeliquid: 300,
        tanklevelpercent: 90,
        rangeelectric: 300,
        soc: 90
      });
    });
  });
});
