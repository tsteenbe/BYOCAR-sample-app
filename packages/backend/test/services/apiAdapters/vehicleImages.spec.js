// SPDX-License-Identifier: MIT

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import spies from 'chai-spies';
import sinon from 'sinon';
import axios from 'axios';
import fs from 'fs';
import VehicleImagesAdapter from '../../../src/services/apiAdapters/vehicleImages';

chai.use(spies);
chai.use(chaiAsPromised);

describe('Vehicle Images Adapter', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();

    // delete images after test
    const path = 'public/images/';
    let regex = /WDD2132231A444556[.]png$/
    fs.readdirSync('public/images').filter(f => regex.test(f)).map(f => fs.unlinkSync(path + f));

    [
      'public/images/EXT150-WDD2054661F444556.png',
      'public/images/EXT330-WDD2054661F444556.png'
    ].filter(f => fs.existsSync(f)).forEach(f => fs.unlinkSync(f));
  });

  describe('Configuration', () => {
    it('should set tryout URL if tryout enabled', () => {
      const config = {
        tryout: true,
        apiKey: 'some_api_key',
        imagePath: 'images',
        downloadHost: 'http://localhost:3000'
      };
      const adapter = new VehicleImagesAdapter(config);

      expect(adapter.url).to.be.a('string').that.equals('https://api.mercedes-benz.com/tryout/vehicle_images/v1');
    });

    it('should set production URL if tryout is disabled', () => {
      const config = {
        tryout: false,
        apiKey: 'some_api_key',
        imagePath: 'images',
        downloadHost: 'http://localhost:3000'
      };
      const adapter = new VehicleImagesAdapter(config);

      expect(adapter.url).to.be.a('string').that.equals('https://api.mercedes-benz.com/vehicle_images/v1');
    });
  });

  describe('Tryout', () => {
    const config = {
      tryout: true,
      apiKey: 'some_api_key',
      imagePath: 'images',
      downloadHost: 'http://localhost:3000'
    };
    const adapter = new VehicleImagesAdapter(config);

    it('should fetch images for tryout and download images', async () => {
      const vehicleId = 'WDD2132231A444556';

      // files do not exist before adapter call
      expect(fs.existsSync(`public/images/EXT150-WDD2132231A444556.png`)).to.be.false;
      expect(fs.existsSync(`public/images/EXT330-WDD2132231A444556.png`)).to.be.false;
      expect(fs.existsSync(`public/images/INT1-WDD2132231A444556.png`)).to.be.false;

      // call adapter
      await expect (adapter.fetch({ vehicleId })).to.eventually.eql({
        imageUrls: [
          'http://localhost:3000/images/EXT150-WDD2132231A444556.png',
          'http://localhost:3000/images/EXT330-WDD2132231A444556.png',
          'http://localhost:3000/images/INT1-WDD2132231A444556.png'
        ]
      });

      // files exist afterwards
      expect(fs.existsSync(`public/images/EXT150-WDD2132231A444556.png`)).to.be.true;
      expect(fs.existsSync(`public/images/EXT330-WDD2132231A444556.png`)).to.be.true;
      expect(fs.existsSync(`public/images/INT1-WDD2132231A444556.png`)).to.be.true;
    }).timeout(10000);

    it('should fetch images for tryout and not download images that exist already', async () => {
      const vehicleId = 'WDD2054661F444556';

      // files partly do not exist before adapter call
      expect(fs.existsSync(`public/images/EXT150-WDD2054661F444556.png`)).to.be.false;
      expect(fs.existsSync(`public/images/EXT330-WDD2054661F444556.png`)).to.be.false;
      expect(fs.existsSync(`public/images/INT1-WDD2054661F444556.png`)).to.be.true;

      // call adapter
      await expect (adapter.fetch({ vehicleId })).to.eventually.eql({
        imageUrls: [
          'http://localhost:3000/images/EXT150-WDD2054661F444556.png',
          'http://localhost:3000/images/EXT330-WDD2054661F444556.png',
          'http://localhost:3000/images/INT1-WDD2054661F444556.png'
        ]
      });

      // all files exist afterwards
      expect(fs.existsSync(`public/images/EXT150-WDD2054661F444556.png`)).to.be.true;
      expect(fs.existsSync(`public/images/EXT330-WDD2054661F444556.png`)).to.be.true;
      expect(fs.existsSync(`public/images/INT1-WDD2054661F444556.png`)).to.be.true;
    }).timeout(10000);
  });

  describe('fetch()', () => {
    const config = {
      tryout: true,
      apiKey: 'some_api_key',
      imagePath: 'images',
      downloadHost: 'http://localhost:3000'
    };
    const adapter = new VehicleImagesAdapter(config);

    it('should call getImageIds() with vehicle ID', async () => {
      const vehicleId = 'WDD2132231A444556';

      sandbox.stub(adapter, 'getImageIds').callsFake(() => { return {}; });

      await adapter.fetch({ vehicleId });

      const spyGetImageIdsCallArgs = adapter.getImageIds.getCall(0).args;

      expect(spyGetImageIdsCallArgs).to.deep.include(vehicleId);
    });

    it('should return empty response when no images are returned', async () => {
      const vehicleId = 'WDD2132231A444556';

      sandbox.stub(adapter, 'getImageIds').callsFake(() => { return {}; });

      await expect(adapter.fetch({ vehicleId })).to.eventually.eql({});
    });

    it('should fetch image data for all image IDs', async () => {
      const vehicleId = 'WDD2132231A444556';

      sandbox.stub(adapter, 'getImageIds').callsFake(() => {
        return {
          EXT150: 'V0REMjEzMjIzMUE0NDQ1NTY6cm9vZk9wZW49ZmFsc2U6bmlnaHQ9ZmFsc2U6RVhUMTUwLnBuZw==',
          EXT330: 'V0REMjEzMjIzMUE0NDQ1NTY6cm9vZk9wZW49ZmFsc2U6bmlnaHQ9ZmFsc2U6RVhUMzMwLnBuZw==',
          INT1: 'V0REMjEzMjIzMUE0NDQ1NTY6cm9vZk9wZW49ZmFsc2U6bmlnaHQ9ZmFsc2U6SU5UMS5wbmc='
        };
      });

      const getImageDataStub = sandbox.stub(adapter, 'getImageData');
      getImageDataStub.onFirstCall().returns({ uri: 'public/images/EXT150-WDD2132231A444556.png', downloaded: true });
      getImageDataStub.onSecondCall().returns({ uri: 'public/images/EXT330-WDD2132231A444556.png', downloaded: true });
      getImageDataStub.onThirdCall().returns({ uri: 'public/images/INT1-WDD2132231A444556.png', downloaded: true });

      await adapter.fetch({ vehicleId });

      const spyGetImageDataCallsArgs = adapter.getImageData.getCalls().map(({ args }) => args);
      
      expect(spyGetImageDataCallsArgs.length).to.equal(3);
      expect(spyGetImageDataCallsArgs).to.deep.include(['EXT150', 'V0REMjEzMjIzMUE0NDQ1NTY6cm9vZk9wZW49ZmFsc2U6bmlnaHQ9ZmFsc2U6RVhUMTUwLnBuZw==', vehicleId]);
      expect(spyGetImageDataCallsArgs).to.deep.include(['EXT330', 'V0REMjEzMjIzMUE0NDQ1NTY6cm9vZk9wZW49ZmFsc2U6bmlnaHQ9ZmFsc2U6RVhUMzMwLnBuZw==', vehicleId]);
      expect(spyGetImageDataCallsArgs).to.deep.include(['INT1', 'V0REMjEzMjIzMUE0NDQ1NTY6cm9vZk9wZW49ZmFsc2U6bmlnaHQ9ZmFsc2U6SU5UMS5wbmc=', vehicleId]);
    });
  });

  describe('getImageIds()', () => {
    const config = {
      tryout: false,
      apiKey: 'some_api_key',
      imagePath: 'images',
      downloadHost: 'http://localhost:3000'
    };
    const adapter = new VehicleImagesAdapter(config);

    it('should call API with vehicle ID and API key and return API response', async () => {
      const vehicleId = 'WDD2132231A444556';

      const mockResponse = {
        EXT150: 'V0REMjEzMjIzMUE0NDQ1NTY6cm9vZk9wZW49ZmFsc2U6bmlnaHQ9ZmFsc2U6RVhUMTUwLnBuZw==',
        EXT330: 'V0REMjEzMjIzMUE0NDQ1NTY6cm9vZk9wZW49ZmFsc2U6bmlnaHQ9ZmFsc2U6RVhUMzMwLnBuZw==',
        INT1: 'V0REMjEzMjIzMUE0NDQ1NTY6cm9vZk9wZW49ZmFsc2U6bmlnaHQ9ZmFsc2U6SU5UMS5wbmc='
      };

      sandbox.stub(axios, 'get').callsFake(() => ({
        status: 200,
        statusText: 'OK',
        data: mockResponse
      }));

      await expect(adapter.getImageIds(vehicleId)).to.eventually.eql(mockResponse);

      const spyCall = axios.get.getCall(0);

      // assert the call with the URL
      expect(spyCall.calledWith(`https://api.mercedes-benz.com/vehicle_images/v1/vehicles/${vehicleId}`)).to.be.true;

      // assert params
      const { params } = spyCall.args[1];
      expect(params['apikey']).to.be.a('string').that.equals(config.apiKey);
    });

    it('should return empty result in case of error', async () => {
      const vehicleId = 'WDD2132231A444556';

      sandbox.stub(axios, 'get').throws(() => ({
        response: {
          status: 500,
          statusText: 'Internal Server Error'
        }
      }));

      await expect(adapter.getImageIds(vehicleId)).to.eventually.eql({});
    });
  });
});
