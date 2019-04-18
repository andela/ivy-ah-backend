import imageControl from '../../../helpers/imageControl';

const { uploadImage, deleteImage } = imageControl;
/**
 *
 *
 * @export
 * @class Image
 */
export default class Image {
/**
 *
 * this function handles the upload of images
 * @static
 * @param {*} request request image file which should be uploaded
 * @param {*} response response after the image has been uploaded
 * @param {*} next called if an error is thrown
 * @memberof Image
 * @return { void }
 */
  static async uploadImage(request, response, next) {
    try {
      if (request.files) {
        const image = await uploadImage(request.files);
        return response.status(200).json({ status: 200, image: image.url });
      }
      return response.status(404).json({ status: 404, error: 'No Image file found' });
    } catch (error) {
      return next(error);
    }
  }

  /**
 *
 *
 * @static
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @memberof Image
 * @return { void }
 */
  static async deleteImage(request, response, next) {
    try {
      const { url } = request.body;
      await deleteImage(url);
      return response.status(200).json({ status: 200, data: 'image deleted sucessfull' });
    } catch (error) {
      return next(error);
    }
  }
}
