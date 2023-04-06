import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { fetchImg } from './js/axiosPhoto';
import { galleryCardRender } from './js/galleryCardRender';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMoreButton.addEventListener('click', onLoadMore);

let searchQuery = '';
let simpleLightBox = null;
const perPage = 40;
let page = 1;

async function onSearchForm(evt) {
  evt.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  page = 1;
  searchQuery = evt.currentTarget.searchQuery.value.trim();
  refs.gallery.innerHTML = '';
  refs.loadMoreButton.classList.add('is-hidden');

  if (!searchQuery) {
    refs.gallery.innerHTML = '';
    return;
  }

  try {
    const { data } = await fetchImg(searchQuery, page);

    if (data.totalHits === 0) {
      notifyNoFindImages();
      refs.gallery.innerHTML = '';
    } else {
      galleryCardRender(data.hits);
      console.log(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      notifyFoundImages(data);

      if (data.totalHits > perPage) {
        refs.loadMoreButton.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  page += 1;
  simpleLightBox.destroy();

  try {
    const { data } = await fetchImg(searchQuery, page);

    galleryCardRender(data.hits);
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();

    const pagesQuantity = Math.ceil(data.totalHits / perPage);

    if (page >= pagesQuantity) {
      refs.loadMoreButton.classList.add('is-hidden');
      notifyEndSearch();
    }
  } catch (error) {
    console.log(error);
  }
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
