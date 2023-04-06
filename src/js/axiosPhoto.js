import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '35059949-3e059907e90d446f04b9db9ab';

export async function fetchImg(queryName, currentPage) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${queryName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}
