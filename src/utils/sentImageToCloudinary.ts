import { v2 as cloudinary } from 'cloudinary'

export const sedImageToCloudinary = async () => {
  // Configuration
  cloudinary.config({
    cloud_name: 'dfthxjnun',
    api_key: '232811338247842',
    api_secret: '<your_api_secret>', // Click 'View Credentials' below to copy your API secret
  })

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
      {
        public_id: 'shoes',
      },
    )
    .catch((error) => {
      console.log(error)
    })

  console.log(uploadResult)
}
