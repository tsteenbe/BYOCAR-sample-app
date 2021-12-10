// SPDX-License-Identifier: MIT

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import spies from 'chai-spies';
import sinon from 'sinon';
import axios from 'axios';
import VehicleDataAdapter from '../../../src/services/apiAdapters/vehicleData';

chai.use(spies);
chai.use(chaiAsPromised);

describe('Vehicle Data Adapter', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });

  describe('Configuration', () => {
    it('should set tryout URL if tryout enabled', () => {
      const config = {
        tryout: true,
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
      };
      const adapter = new VehicleDataAdapter(config);

      expect(adapter.url).to.be.a('string').that.equals('https://api.mercedes-benz.com/vehicledata_tryout/v2');
    });

    it('should set production URL if tryout is disabled', () => {
      const config = {
        tryout: false,
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
      };
      const adapter = new VehicleDataAdapter(config);

      expect(adapter.url).to.be.a('string').that.equals('https://api.mercedes-benz.com/vehicledata/v2');
    });
  });

  describe('Tryout', () => {
    const config = {
      tryout: true,
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
    };
    const adapter = new VehicleDataAdapter(config);

    it('should call fuelstatus with tryout token', async () => {
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      sandbox.stub(adapter, 'getContainerResponse').callsFake(() => { return []; });

      await adapter.fetch({ vehicleId, accessToken });

      const spyGetContainerResponseCallsArgs = adapter.getContainerResponse.getCalls().map(({ args }) => args);
      
      expect(spyGetContainerResponseCallsArgs).to.deep.include(['fuelstatus', vehicleId, '7c7c777c-f123-4123-s123-7c7c777c7c77']);
    });

    it('should call electricvehicle with tryout token', async () => {
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      sandbox.stub(adapter, 'getContainerResponse').callsFake(() => { return []; });

      await adapter.fetch({ vehicleId, accessToken });

      const spyGetContainerResponseCallsArgs = adapter.getContainerResponse.getCalls().map(({ args }) => args);

      expect(spyGetContainerResponseCallsArgs).to.deep.include(['electricvehicle', vehicleId, '2c2c222c-e123-4123-v123-2c2c222c2c22']);
    });

    it('should return tryout responses', async () => {
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      await expect(adapter.fetch({ vehicleId, accessToken })).to.eventually.eql({
        rangeliquid: 1292,
        tanklevelpercent: 90,
        rangeelectric: 456,
        soc: 90
      });
    });
  });

  describe('fetch()', () => {
    const config = {
      tryout: false,
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
    };
    const adapter = new VehicleDataAdapter(config);

    it('should use provided token for all endpoints when tryout is disabled', async () => {
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      sandbox.stub(adapter, 'getContainerResponse').callsFake(() => { return []; });

      await adapter.fetch({ vehicleId, accessToken });

      const spyGetContainerResponseCallsArgs = adapter.getContainerResponse.getCalls().map(({ args }) => args);
      
      expect(spyGetContainerResponseCallsArgs.length).to.equal(2);
      expect(spyGetContainerResponseCallsArgs).to.deep.include(['fuelstatus', vehicleId, accessToken]);
      expect(spyGetContainerResponseCallsArgs).to.deep.include(['electricvehicle', vehicleId, accessToken]);
    });

    it('should convert container response to key-value pairs', async () => {
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      const getContainerResponseStub = sandbox.stub(adapter, 'getContainerResponse');
      getContainerResponseStub.onFirstCall().returns([
        {
          tanklevelpercent: {
            value: '90',
            timestamp: 1541080800000
          }
        },
        {
          rangeliquid: {
            value: '1292',
            timestamp: 1541080800000
          }
        }
      ]);
      getContainerResponseStub.onSecondCall().returns([
        {
          soc: {
            value: '90',
            timestamp: 1541080800000
          }
        },
        {
          rangeelectric: {
            value: '456',
            timestamp: 1541080800000
          }
        }
      ]);

      await expect(adapter.fetch({ vehicleId, accessToken })).to.eventually.eql({
        rangeliquid: 1292,
        tanklevelpercent: 90,
        rangeelectric: 456,
        soc: 90
      });
    });
  });

  describe('getContainerResponse()', () => {
    const config = {
      tryout: false,
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
    };
    const adapter = new VehicleDataAdapter(config);

    it('should throw an error when authentication fails', async () => {
      const endpoint = 'fuelstatus';
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      sandbox.stub(axios, 'get').throws({ response: { status: 401, statusText: 'Unauthorized' } });

      await expect(adapter.getContainerResponse(endpoint, vehicleId, accessToken)).to.be.rejectedWith('Authentication for BYOCAR failed');
    });

    it('should return an error object when a request fails', async () => {
      const endpoint = 'fuelstatus';
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      const errorResponse = {
        exveErrorId: 'string',
        exveErrorMsg: 'string',
        exveErrorRef: 'string'
      };

      sandbox.stub(axios, 'get').throws({
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: errorResponse
        }
      });

      await expect(adapter.getContainerResponse(endpoint, vehicleId, accessToken)).to.eventually.eql([
        {
          fuelstatusError: {
            status: 500,
            errorDetails: errorResponse
          }
        }
      ]);
    });

    it('should call API with provided arguments and return response', async () => {
      const endpoint = 'fuelstatus';
      const vehicleId = 'WDB111111ZZZ22222';
      const accessToken = 'some_token';

      const mockResponse = [
        {
          tanklevelpercent: {
            value: '90',
            timestamp: 1541080800000
          }
        },
        {
          rangeliquid: {
            value: '1292',
            timestamp: 1541080800000
          }
        }
      ];

      sandbox.stub(axios, 'get').callsFake(() => ({
        status: 200,
        statusText: 'OK',
        data: mockResponse
      }));

      await expect(adapter.getContainerResponse(endpoint, vehicleId, accessToken)).to.eventually.equal(mockResponse);

      const spyCall = axios.get.getCall(0);

      // assert the call with the URL
      expect(spyCall.calledWith(`https://api.mercedes-benz.com/vehicledata/v2/vehicles/${vehicleId}/containers/${endpoint}`)).to.be.true;

      // assert the headers
      const { headers } = spyCall.args[1];
      expect(headers['Authorization']).to.be.a('string').that.equals(`Bearer ${accessToken}`);
    });
  });
});
