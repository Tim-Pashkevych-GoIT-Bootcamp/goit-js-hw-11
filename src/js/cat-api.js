import axios from 'axios';
import 'dotenv/config';

const BASE_URL = 'https://api.thecatapi.com';

// Add our API key to every requeset
axios.defaults.headers.common['x-api-key'] = process.env.CAT_API_KEY;

// Fetch Breeds function
export const fetchBreeds = () => {
  const END_POINT = '/v1/breeds';

  return axios.get(`${BASE_URL}${END_POINT}`).then(respose => {
    return respose.data.map(({ id, name }) => ({ id, name }));
  });
};

// Fetch Cat by breed function
export const fetchCatByBreed = breedId => {
  const END_POINT = '/v1/images/search';
  const SERCH_PARAMS = new URLSearchParams({
    breed_ids: breedId,
  });

  return axios.get(`${BASE_URL}${END_POINT}?${SERCH_PARAMS}`).then(respose => {
    const data = respose.data.shift();
    const { height, width, url } = data;
    const { name, description, temperament } = data.breeds.shift();

    return {
      img: {
        height,
        width,
        url,
      },
      info: {
        name,
        description,
        temperament,
      },
    };
  });
};
