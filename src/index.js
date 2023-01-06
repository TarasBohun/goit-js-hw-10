import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputSearch = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearch.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const searchCountry = e.target.value.trim();

  clearMarkup();

  if (!searchCountry) {
    return;
  }

  fetchCountries(searchCountry)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (data.length > 1) {
        countriesList.hidden = false;

        countriesList.innerHTML = markupDiferentCountries(data);

        return;
      }

      if (data.length === 1) {
        clearMarkup();
        countriesList.hidden = true;
        countryInfo.innerHTML = markupCountry(data);

        return;
      }
    })
    .catch(error => {
      console.log(error.message);
      if (error.message === 'Not Found') {
        Notify.failure('Oops, there is no country with that name');
      }
    });
}

function markupDiferentCountries(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.svg}" alt="${name}" width='50'/>
      <span>${name.official}</span></li>`
    )
    .join('');
}

function markupCountry(data) {
  return data
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<div class='country-title'>
        <img src="${flags.svg}" alt="${name}" width='60' height='40'/>
        <h1 class='country-title__name'>${name.official}</h1>
      </div>
      <ul class='country-info'>
        <li class='country-info__item'><h2>Capital:</h2><span>${capital}</span></li>
        <li class='country-info__item'><h2>Population:</h2><span>${population}</span></li>
        <li class='country-info__item'><h2>Languages:</h2><span>${Object.values(
          languages
        )}</span></li>
      </ul>`
    )
    .join('');
}

function clearMarkup() {
  countryInfo.innerHTML = '';
  countriesList.innerHTML = '';
}
