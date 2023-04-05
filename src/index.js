import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { fetchImg } from './js/axiosPhoto';
import { galleryCardRender } from './js/galleryCardRender';

const refs = {
  searchForm: document.querySelector('#search-form'),
  loadMoreButton: document.querySelector('.load-more'),
  page: 1,
};

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMoreButton.addEventListener('click', onLoadMore);

let searchQuery = '';
let simpleLightBox = null;

function onSearchForm(evt) {
  evt.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  refs.page = 1;
  searchQuery = evt.currentTarget.searchQuery.value.trim();
  refs.loadMoreButton.style.display = 'block';

  if (!searchQuery) {
    return;
  }

  fetchImg(searchQuery, refs.page)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        notifyNoFindImages();
      } else {
        galleryCardRender(data.hits);
        console.log(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        notifyFoundImages(data);

        if (data.totalHits < data.hits) {
          refs.loadMoreButton.style.display = 'none';
        }
      }
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  refs.page += 1;
  simpleLightBox.destroy();

  fetchImg(searchQuery, refs.page)
    .then(({ data }) => {
      galleryCardRender(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const pagesQuantity = Math.ceil(data.totalHits / data.hits);

      if (refs.page >= pagesQuantity) {
        refs.loadMoreButton.style.display = 'none';
        notifyEndSearch();
      }
    })
    .catch(error => console.log(error));
}

function notifyNoFindImages() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notifyFoundImages(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function notifyEndSearch() {
  Notiflix.Notify.failure(
    `We're sorry, but you've reached the end of search results.`
  );
}
