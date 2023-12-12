import axios from 'axios';
import 'dotenv/config';

class PixabayApi {
  #baseUrl = 'https://pixabay.com';
  #endPoint = '/api/';
  #query;
  #total;
  #page;
  #perPage;
  #lastPage;

  constructor() {
    this.#page = 1;
    this.#perPage = 20;
  }

  get total() {
    return this.#total;
  }

  get page() {
    return this.#page;
  }

  get lastPage() {
    return this.#lastPage;
  }

  fetchPhotos(query, page) {
    // Update settings
    this.#query = query ?? this.#query;
    this.#page = page ?? this.#page;

    const params = new URLSearchParams({
      key: process.env.PIXABAY_API_KEY,
      q: this.#query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.#page,
      per_page: this.#perPage,
    });

    return axios
      .get(`${this.#baseUrl}${this.#endPoint}?${params}`)
      .then(respose => {
        // Validation
        if (!this.#query) {
          throw new Error('Please, enter keywords for search');
        }
        if (!respose.data.total && this.#page === 1) {
          throw new Error(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }

        // Save default settings one time, when we load first page
        if (this.#page === 1) {
          // Save total hits number
          this.#total = respose.data.totalHits;

          // Save Last page number
          this.#lastPage = Math.ceil(this.#total / this.#perPage);
        }

        // Return only data we need
        return respose.data.hits.map(
          ({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }) => ({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          })
        );
      });
  }
}

export default PixabayApi;
