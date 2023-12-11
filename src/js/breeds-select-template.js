const breedsSelectTemplate = cat =>
  `<option value='${cat.id}'>${cat.name}</option>`;

export const renderBreedsSelect = cats =>
  cats.map(breedsSelectTemplate).join('');
