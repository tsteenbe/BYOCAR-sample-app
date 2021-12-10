// SPDX-License-Identifier: MIT

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import spies from 'chai-spies';
import sinon from 'sinon';
import axios from 'axios';
import { AuthService } from '../../src/services';

chai.use(spies);
chai.use(chaiAsPromised);

describe('Auth Service', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });

  const config = {
    clientId: 'some_client_id',
    clientSecret: 'some_client_secret',
    redirectUri: 'http://localhost:8080/'
  };
  const service = new AuthService(config);

  describe('getAccessToken()', () => {
    it('should throw error when called without auth code', async () => {
      const authCode = undefined;

      await expect(service.getAccessToken(authCode)).to.be.rejectedWith('No authorization code provided');
    });

    it('should throw an error when server response is missing a token', async () => {
      sandbox.stub(axios, 'post').callsFake(() => ({ data: { access_token: undefined } }));

      const authCode = 'some_auth_code';

      await expect(service.getAccessToken(authCode)).to.be.rejectedWith('Authentication failed');
    });

    it('should not throw an error in tryout mode when server response is missing a token', async () => {
      const service1 = new AuthService( { ...config, tryout: true });
      sandbox.stub(axios, 'post').callsFake(() => ({ data: { access_token: undefined } }));

      const authCode = 'some_auth_code';

      await expect(service1.getAccessToken(authCode)).to.eventually.equal(undefined);
    });

    it('should call token URL and return token from server response', async () => {
      const authCode = 'some_auth_code';

      const mockToken = 'an_access_token';
      sandbox.stub(axios, 'post').callsFake(() => ({ data: { access_token: mockToken } }));

      await expect(service.getAccessToken(authCode)).to.eventually.equal(mockToken);

      const spyCall = axios.post.getCall(0);

      // assert the call with the URL
      expect(spyCall.calledWith('https://id.mercedes-benz.com/as/token.oauth2')).to.be.true;

      // assert params
      const params = spyCall.args[1];
      expect(params.get('grant_type')).to.be.a('string').that.equals('authorization_code');
      expect(params.get('code')).to.be.a('string').that.equals(authCode);
      expect(params.get('redirect_uri')).to.be.a('string').that.equals(config.redirectUri);

      // assert the headers
      const { headers } = spyCall.args[2];
      expect(headers['Authorization']).to.be.a('string').that.equals('Basic c29tZV9jbGllbnRfaWQ6c29tZV9jbGllbnRfc2VjcmV0');
      expect(headers['Content-Type']).to.be.a('string').that.equals('application/x-www-form-urlencoded');
    });
  });
});
