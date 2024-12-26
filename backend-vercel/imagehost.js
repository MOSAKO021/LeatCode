const axios = require('axios');
const fs = require('fs');

const imagePath = './img.jpg'; // Path to your local image file
const imageData = fs.readFileSync(imagePath).toString('base64'); // Convert image to base64

const encodedParams = new URLSearchParams();
encodedParams.set('image', imageData);
encodedParams.set('name', 'img.jpg');

const options = {
  method: 'POST',
  url: 'https://upload-images-hosting-get-url.p.rapidapi.com/upload',
  headers: {
    'x-rapidapi-key': '1e56c7fe08msh598de54ab4321b7p16a2fcjsn9b3449ef0f23',
    'x-rapidapi-host': 'upload-images-hosting-get-url.p.rapidapi.com',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  data: encodedParams,
};

(async () => {
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
})();
