import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixabayApi from './pixabay-api.js';
import photoCardTemplate from './photo-card-template.js';

const refs = {
  formElement: document.querySelector('#search-form'),
  scrollModeElement: document.querySelector('#scroll-mode'),
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
  rootMargin: '300px',
  threshold: 1.0,
});

/**
  |============================
  | Function to Process Request
  |============================
*/
function processRequest(query, page) {
  // Send request to a server
  pixabayApi
    .fetchPhotos(query, page)
    .then(photos => {
      if (page === 1) {
        // Display Total Found message only when we are on the first page
        Notify.success(`Hooray! We found ${pixabayApi.total} images.`);

        // Add observer if Scroll Mode enabled
        if (refs.scrollModeElement.checked) {
          observer.observe(refs.loadMoreBtnElement);
        }
      }

      // Insert new Images to the content
      refs.galleryElement.insertAdjacentHTML(
        'beforeend',
        photos.map(photoCardTemplate).join('')
      );

      // Reinitilize the lightbox
      gallery.refresh();

      // If we have reached the last page, then remove observer
      if (pixabayApi.page > pixabayApi.lastPage) {
        throw new Error(
          "We're sorry, but you've reached the end of search results."
        );
      }

      // Show/Hide Load More button if Scroll Mode disabled
      if (!refs.scrollModeElement.checked) {
        // Scroll page only when we load second and any other page
        if (page !== 1) {
          scroll();
        }
        // Check if we need to show/hide Load More button
        if (pixabayApi.page !== pixabayApi.lastPage) {
          showLoadMoreBtn();
        } else {
          hideLoadMoreBtn();
        }
      }
    })
    .catch(error => {
      // Show Error message
      Notify.failure(error.message);

      // Remove observer if Scroll Mode enabled
      if (refs.scrollModeElement.checked) {
        observer.unobserve(refs.loadMoreBtnElement);
      }
    });
}

/**
  |============================
  | UI unil functions
  |============================
*/
// Function to clear content
function clearContent() {
  refs.galleryElement.innerHTML = '';

  //Hide Load More button if Scroll Mode disabled
  if (!refs.scrollModeElement.checked) {
    hideLoadMoreBtn();
  }
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
    top: window.innerHeight - cardHeight / 2,
    behavior: 'smooth',
  });
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

  // Remove observer if Scroll Mode enabled
  if (refs.scrollModeElement.checked) {
    observer.unobserve(refs.loadMoreBtnElement);
  }

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

/**
  |============================
  | Add Event Listener for Scroll Mode checkbox
  |============================
*/
refs.scrollModeElement.addEventListener('change', onScrollModeChange);

function onScrollModeChange(event) {
  // If we didn't input keywords, then return from a function
  if (!refs.searchQueryElement.value) {
    return;
  }

  if (event.target.checked) {
    // Add observer
    observer.observe(refs.loadMoreBtnElement);

    // Hide Load More button
    hideLoadMoreBtn();
  } else {
    //  Remove observer
    observer.unobserve(refs.loadMoreBtnElement);

    // Check if we need to Show Load More button
    if (pixabayApi.page <= pixabayApi.lastPage) {
      showLoadMoreBtn();
    }
  }
}
