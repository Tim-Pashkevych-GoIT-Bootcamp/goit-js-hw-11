const photoCardTemplate = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) =>
  `<a class="photo-card" href="${largeImageURL}">
    <div class="image"><span class="loader"></span><img src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
    <div class="info">
      <p class="info-item">
        <b>Likes</b><span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b><span>${views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b><span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b><span>${downloads}</span>
      </p>
    </div>
  </a>`;

export default photoCardTemplate;
