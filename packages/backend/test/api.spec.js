// SPDX-License-Identifier: MIT

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../src';
import { AuthService, VehicleService } from '../src/services';

chai.use(chaiHttp);
chai.should();

describe('Vehicle API', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /api/vehicle/:vehicleId', () => {
    it('should return status 200', (done) => {
      sandbox.stub(AuthService.prototype, 'getAccessToken').callsFake(() => { return 'some_token' });
      sandbox.stub(VehicleService.prototype, 'getVehicleData').callsFake(() => ({
        rangeliquid: {
          value: 300
        },
        tanklevelpercent: {
          value: 90
        },
        rangeelectric: {
          value: 300
        },
        soc: {
          value: 90
        },
        imageUrls: [
          'http://localhost:3000/images/EXT10-WDD2132231A444556.png',
          'http://localhost:3000/images/INT1-WDD2132231A444556.png'
        ]
      }));

      const vehicleId = 'WDB111111ZZZ22222';
      const code = 'some_auth_code';

      chai.request(app)
        .get(`/api/vehicle/${vehicleId}`)
        .set('X-Authorization-Code', code)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');

          done();
        });
    });

    it('should return status 404 without vehicleId path param', (done) => {
      const vehicleId = '';
      const code = 'some_auth_code';

      chai.request(app)
        .get(`/api/vehicle/${vehicleId}`)
        .set('X-Authorization-Code', code)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');

          done();
        });
    });

    it('should return status 400 without X-Authorization-Code header', (done) => {
      const vehicleId = 'WDB111111ZZZ22222';
      const code = '';

      chai.request(app)
        .get(`/api/vehicle/${vehicleId}`)
        .set('X-Authorization-Code', code)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.a('string').that.equals('No authorization code provided');

          done();
        });
    });
  });
});
