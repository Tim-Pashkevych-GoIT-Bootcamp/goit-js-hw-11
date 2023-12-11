import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import { renderBreedsSelect } from './breeds-select-template.js';
import { renderCatInfo } from './cat-info-template.js';

const refs = {
  breedSelect: document.querySelector('.breed-select'),
  loaderElement: document.querySelector('p.loader'),
  errorElement: document.querySelector('p.error'),
  catInfoElement: document.querySelector('.cat-info'),
};

// Functions to show/hide Loader
function showLoader() {
  refs.loaderElement.classList.remove('hidden');
}
function hideLoader() {
  refs.loaderElement.classList.add('hidden');
}

// Functions to show/hide Error message
function showError() {
  refs.errorElement.classList.remove('hidden');
  Notify.failure(refs.errorElement.textContent);
}
function hideError() {
  refs.errorElement.classList.add('hidden');
}

// Functction to insert HTML template and show
function updateContent(element, content) {
  element.innerHTML = content;
  element.classList.remove('hidden');
}
function hideContent(element) {
  element.classList.add('hidden');
}

// Show loader
showLoader();

// Fetch Breeds
fetchBreeds()
  .then(cats => {
    updateContent(refs.breedSelect, renderBreedsSelect(cats));

    new SlimSelect({
      select: '#breed-select-id',
    });
  })
  .catch(showError)
  .finally(hideLoader);

// Add Event listener
refs.breedSelect.addEventListener('change', onSelectBreed);

function onSelectBreed(event) {
  // Hide content
  hideContent(refs.catInfoElement);

  // Hide Error message
  hideError();

  // Show loader
  showLoader();

  // Fetch the data
  fetchCatByBreed(event.target.value)
    .then(cat => {
      updateContent(refs.catInfoElement, renderCatInfo(cat));
    })
    .catch(showError)
    .finally(hideLoader);
}
