import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

const uploadToCloudinary = (file: Express.Multer.File, folder: string) => {
      return new Promise<UploadApiResponse>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                  {
                        folder
                  },
                  (error, result) => {
                        if (result) {
                              resolve(result)
                        } else {
                              reject(error)
                        }
                  }
            )

            streamifier.createReadStream(file.buffer).pipe(stream)
      })
}

export default uploadToCloudinary
