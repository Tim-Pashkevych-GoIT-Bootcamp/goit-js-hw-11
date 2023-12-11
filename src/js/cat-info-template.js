export const renderCatInfo = ({ img, info }) => {
  return `<div class="cat-img"><img src="${img.url}" alt="${info.name}" width="${img.width}" height="${img.height}""></div><div class="cat-desc"><h1 class="cat-name">${info.name}</h1><p class="cat-desc">${info.description}</p><p class="cat-temperament"><strong>Temperament: </strong>${info.temperament}</p></div>`;
};
