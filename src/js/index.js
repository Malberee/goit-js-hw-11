import SimpleLightbox from 'simplelightbox'
import 'simplelightbox/dist/simple-lightbox.min.css'
import axios from 'axios'
import { Notify } from 'notiflix'

const API_URL = 'https://pixabay.com/api/'

const form = document.querySelector('.search-form')
const gallery = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')

form.addEventListener('submit', onFormSubmit)
loadMoreBtn.addEventListener('click', () =>
	getImages(form.elements.searchQuery.value)
)

let page
let totalImagesLoaded = 0

function onFormSubmit(e) {
	e.preventDefault()

	gallery.innerHTML = ''

	page = 1

	const formValue = form.elements.searchQuery.value.trim()

	if (formValue !== '') {
		getImages(formValue)
	}
}

async function getImages(value) {
	loadMoreBtn.classList.add('is-hidden')
	const options = {
		params: {
			key: '34735495-c5ef181074f4f4736bdb9177b',
			q: value,
			image_type: 'photo',
			orientation: 'horizontal',
			safesearch: 'true',
			page: page,
			per_page: 40,
		},
	}

	try {
		await axios.get(API_URL, options).then(res => {
			if (!res.data.hits.length) {
				Notify.failure(
					'Sorry, there are no images matching your search query. Please try again.'
				)
				return
			}
			console.log(res.data)
			totalImagesLoaded += res.data.hits.length
			if (totalImagesLoaded >= res.data.totalHits) {
				loadMoreBtn.classList.add('is-hidden')
				Notify.info(
					"We're sorry, but you've reached the end of search results."
				)
			}
			loadMoreBtn.classList.remove('is-hidden')
			renderGallery(res.data.hits)
			page += 1
		})
	} catch (err) {
		console.log(err.message)
		return
	}
}

function renderGallery(data) {
	data.forEach(image => {
		const {
			webformatURL,
			largeImageURL,
			tags,
			likes,
			views,
			comments,
			downloads,
		} = image

		gallery.insertAdjacentHTML(
			'beforeend',
			`
        <a href="${largeImageURL}" class="card-link js-card-link">
            <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" class="image"/>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${downloads}
            </p>
          </div>
        </div>
        </a>
        `
		)
	})
	lightbox.refresh()
}

const lightbox = new SimpleLightbox('.gallery a', {
	captionsData: 'alt',
	captionDelay: 250,
})
