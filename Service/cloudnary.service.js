import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary';
import env from 'dotenv'
import path from 'path';


env.config()


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_SECRET_KEY
})

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'moviePosters',
        format: async (req, file) => {
            const validFileExtention = ['jpeg', 'jpg', 'png', 'avif']
            const posterExtention = file.mimetype.split('/')[1]
            if (validFileExtention.includes(posterExtention)) {
                return 'webp'
            } 
            throw new Error('Unsupported File Type')
        },
        public_id: (req, file) => {
            const name = path.parse(file.originalname).name;
            return file.fieldname + '-' + Date.now() + '-' + name;
        },
    },
});
