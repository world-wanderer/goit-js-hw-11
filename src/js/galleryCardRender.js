export { galleryCardRender };

const gallery = document.querySelector('.gallery');

function galleryCardRender(images) {
  const markup = images
    .map(img => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = img;
      return `
    <a class="link-item" href="${largeImageURL}">
    <div class="photo-card" id="${id}">
     <img src="${webformatURL}" alt="${tags}" loading="lazy" />
     <div class="info">
      <p class="info-item">
        <b class="info-word">Likes:</b>${likes}
      </p>
      <p class="info-item">
        <b class="info-word">Views:</b>${views}
      </p>
      <p class="info-item">
        <b class="info-word">Comments:</b>${comments}
      </p>
      <p class="info-item">
        <b class="info-word">Downloads:</b>${downloads}
      </p>
    </div>
  </div>
  </a>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
