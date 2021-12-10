// SPDX-License-Identifier: MIT

import axios from 'axios';
import download from 'download';
import fs from 'fs';

/**
 * This adapter downloads the images of the vehicle and returns the URIs to display them.
 */
class VehicleImagesAdapter {

  API_URL = 'https://api.mercedes-benz.com/vehicle_images/v1';
  TRYOUT_API_KEY = 'd705585c-a672-11ea-bb37-0242ac130002';

  constructor(config) {
    this.tryout = config.tryout;
    this.url = this.tryout ? this.API_URL.replace('vehicle_images', 'tryout/vehicle_images') : this.API_URL;
    this.apiKey = this.tryout ? this.TRYOUT_API_KEY : config.apiKey;
    this.imagePath = config.imagePath;
    this.downloadHost = config.downloadHost;

    console.log('Instantiated VehicleImagesAdapter');
  }

  /**
   * Fetches vehicle image IDs to then download the images from the Vehicle Images API.
   * If the API request to get the image IDs fails or the image could not be downloaded,
   * the image URLs are omitted in the result.
   * 
   * @param {*} the parameter object defining `vehicleId`
   * @returns the URIs of downloaded images
   */
  async fetch({ vehicleId } = {}) {
    console.warn(`Getting vehicle images for VIN ${vehicleId}...`);

    const images = await this.getImageIds(vehicleId);
    if (Object.keys(images).length === 0) {
      console.warn(`Did not get any images for vehicle ID ${vehicleId}`);
      return {};
    }

    const imageData = await Promise.all(Object.keys(images).map(async (perspective) => this.getImageData(perspective, images[perspective], vehicleId)));

    console.log(`Retrieved image data for vehicle ID ${vehicleId}`, imageData);

    const imageUrls = imageData.filter(({ downloaded } = {}) => downloaded).map(({ uri } = {}) => `${this.downloadHost}/${uri}`);

    return { imageUrls };
  }

  /**
   * Fetches the available perspectives for a vehicle.
   * 
   * @param {*} vehicleId the vehicle ID
   * @returns the perspectives and associated image IDs
   */
  async getImageIds(vehicleId) {
    try {
      const { data = {} } = await axios.get(`${this.url}/vehicles/${vehicleId}`, { params: { apikey: this.apiKey } });

      console.log(`Found ${Object.keys(data).length} perspectives for vehicle ID ${vehicleId}`);

      return data;
    } catch (err) {
      const { response = {} } = err;
      const { status, statusText, data: responseBody } = response;
      console.warn(`Retrieving image IDs for vehicle ID ${vehicleId} failed with ${status} ${statusText}:`, responseBody);
    }
    return {};
  }

  /**
   * Attempts to download an image.
   * 
   * @param {*} perspective the perspective
   * @param {*} imageId the image ID
   * @param {*} vehicleId the vehicle ID
   * @returns status infomation, i.e., the image URI and the download status
   */
  async getImageData(perspective, imageId, vehicleId) {
    const filename = getFilename(perspective, vehicleId);
    const uri = `${this.imagePath}/${filename}`;
    let downloaded = imageAlreadyDownloaded(uri);

    if (!downloaded) {
      try {
        await download(`${this.url}/images/${imageId}?apikey=${this.apiKey}`, `public/${this.imagePath}`, { filename });
        downloaded = imageAlreadyDownloaded(uri);
      } catch (err) {
        console.warn(`Could not download perspective ${perspective} for vehicle ID ${vehicleId} with image ID ${imageId}`, err);
      }
    }

    return { uri, downloaded };
  }
};

const getFilename = (perspective, vehicleId) => `${perspective}-${vehicleId}.png`;

const imageAlreadyDownloaded = (uri = '') => fs.existsSync(`public/${uri}`);

export default VehicleImagesAdapter;
