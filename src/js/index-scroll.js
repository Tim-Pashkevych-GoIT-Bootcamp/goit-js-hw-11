import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixabayApi from './pixabay-api.js';
import photoCardTemplate from './photo-card-template.js';

const refs = {
  formElement: document.querySelector('#search-form'),
  searchQueryElement: document.querySelector('input[name="searchQuery"]'),
  submitBtnElement: document.querySelector('button[type="submit"]'),
  galleryElement: document.querySelector('.gallery'),
  loadMoreBtnElement: document.querySelector('button.load-more'),
  backdropElement: document.querySelector('.backdrop'),
};

// Initialize SimpleLightbox
const gallery = new SimpleLightbox('.gallery a');

// Create new object to handle all requests
const pixabayApi = new PixabayApi();

// Create observer
const observer = new IntersectionObserver(observeLoadMoreBtn, {
  rootMargin: '200px',
  threshold: 1.0,
});

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

      // Add observer if Scroll Mode enabled
      observer.observe(refs.loadMoreBtnElement);
    }

    // Insert new Images to the content
    refs.galleryElement.insertAdjacentHTML(
      'beforeend',
      photos.map(photoCardTemplate).join('')
    );

    // Reinitilize the lightbox
    gallery.refresh();

    // If we have reached the last page, then show message and remove observer
    if (pixabayApi.page >= pixabayApi.lastPage) {
      throw new Error(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    // Show Error message
    Notify.failure(error.message);

    // Remove observer
    observer.unobserve(refs.loadMoreBtnElement);
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
}
function observeLoadMoreBtn(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Send request to the server and render HTML
      processRequest(null, pixabayApi.page + 1);
    }
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

  // Remove observer
  observer.unobserve(refs.loadMoreBtnElement);

  // Send request to the server and render HTML
  processRequest(event.target.elements.searchQuery.value, 1);
}
