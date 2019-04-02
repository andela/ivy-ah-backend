/* eslint-disable camelcase */
import cloudinary from 'cloudinary';
import { config } from 'dotenv';

config();

cloudinary.config();

/**
 * extracts unique image id from url to be used
 * during image delete
 * @param {String} url url to extract id from
 * @returns {String} id extracted from url
 */
const extractId = url => /v\d+\/([\w\W]+)\.\w+$/.exec(url)[1];

/**
 * interfaces with the cloudinay api and
 * provides methods for uploading and deleting
 * images from cloudinary
 * @class imageControl
 * @method uploadImage
 * @method deleteImage
 */
class imageControl {
  /**
   * uploads an image file to cloudinary
   * @static
   * @param {File} [file] file object
   * @param {Options} options cloudinary API options
   * @returns {Promise} promise resolves with an object containing uploaded image details
   * or rejects with an Error object
   * @memberof imageControl
   */
  static uploadImage([file], options = {}) {
    return new Promise((res, rej) => {
      const typeArray = ['image/jpg', 'image/png', 'image/jpeg'];
      if (!typeArray.includes(file.mimetype)) return rej(Error('invalid mime-type'));
      if (!options.folder) options.folder = file.fieldname;

      cloudinary.uploader.upload_stream((image, error) => {
        if (error) return rej(Error('image upload failed'));
        res(image);
      }, options).end(file.buffer);
    });
  }

  /**
   * deletes an image file from cloudinary
   * @static
   * @param {String} url url of the image to be deleted
   * @returns {promise} resolves with an object containing details of the delete action or
   * rejects with an error
   * @memberof imageControl
   */
  static deleteImage(url) {
    return new Promise((res, rej) => {
      cloudinary.v2.api.delete_resources(
        extractId(url),
        (error, result) => {
          if (error) return rej(error);
          res(result);
        }
      );
    });
  }
}

export default imageControl;
