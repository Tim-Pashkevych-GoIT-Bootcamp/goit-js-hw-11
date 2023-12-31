import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixabayApi from './pixabay-api.js';
import photoCardTemplate from './photo-card-template.js';

const refs = {
  formElement: document.querySelector('#search-form'),
  galleryElement: document.querySelector('.gallery'),
  loadMoreBtnElement: document.querySelector('button.load-more'),
};

// Initialize SimpleLightbox
const gallery = new SimpleLightbox('.gallery a');

// Create new object to handle all requests
const pixabayApi = new PixabayApi();

/**
  |============================
  | Function to Process Request
  |============================
*/
async function processRequest(query, page) {
  // Send request to a server
  try {
    // Fetch Photos from a server
    const photos = await pixabayApi.fetchPhotos(query, page);

    if (page === 1) {
      // Display Total Found message only when we are on the first page
      Notify.success(`Hooray! We found ${pixabayApi.total} images.`);
    }

    // Insert new Images to the content
    refs.galleryElement.insertAdjacentHTML(
      'beforeend',
      photos.map(photoCardTemplate).join('')
    );

    // Reinitilize the lightbox
    gallery.refresh();

    // Scroll page only when we load second and any other page
    if (page !== 1) {
      scroll();
    }

    // Check if we have reached the last page
    if (pixabayApi.page >= pixabayApi.lastPage) {
      hideLoadMoreBtn();

      // Throw error message
      throw new Error(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      showLoadMoreBtn();
    }
  } catch (error) {
    // Show Error message
    Notify.failure(error.message);
  }
}

/**
  |============================
  | UI unil functions
  |============================
*/
// Function to clear content
function clearContent() {
  refs.galleryElement.innerHTML = '';

  //Hide Load More button
  hideLoadMoreBtn();
}
// Function to Show Load More button
function showLoadMoreBtn() {
  refs.loadMoreBtnElement.classList.remove('is-hidden');
}
// Function to Hide Load More button
function hideLoadMoreBtn() {
  refs.loadMoreBtnElement.classList.add('is-hidden');
}
// Function to scroll page
function scroll() {
  const { height: cardHeight } =
    refs.galleryElement.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: window.innerHeight - cardHeight,
    behavior: 'smooth',
  });
}

/**
  |============================
  | Add Event Listener for Form submit event
  |============================
*/
refs.formElement.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  // Prevent default form submit action
  event.preventDefault();

  // Clear content
  clearContent();

  // Send request to the server and render HTML
  processRequest(event.target.elements.searchQuery.value, 1);
}

/**
  |============================
  | Add Event Listener for Load More button
  |============================
*/
refs.loadMoreBtnElement.addEventListener('click', onLoadMoreBtnClick);

function onLoadMoreBtnClick(event) {
  // Send request to the server and render HTML
  processRequest(null, pixabayApi.page + 1);
}
