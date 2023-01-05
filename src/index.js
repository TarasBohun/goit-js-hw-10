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
  // console.log(searchCountry);

  clearMarkup();

  if (!searchCountry) {
    return;
  }

  // console.log('не вийшли');

  fetchCountries(searchCountry)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        console.log(data.length);
        return;
      }

      if (data.length > 1) {
        // console.log(data.length);

        countriesList.innerHTML = markupDiferentCountries(data);

        return;
      }

      if (data.length === 1) {
        // console.log(data.length);

        clearMarkup();

        countryInfo.innerHTML = markupCountry(data);
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
  // const markup =
  data
    .map(({ name, flags }) => {
      `<li><img src="${flags.svg}" alt="${name}" width='24'/>
      <span>${name.official}</span></li>`;
    })
    .join('');

  // countriesList.insertAdjacentHTML('beforeend', markup);
}

function markupCountry(data) {
  data
    .map(({ name, capital, population, flags, languages }) => {
      `<div>
        <img src="${flags.svg}" alt="${name}" />
        <h1>${name.official}</h1>
      </div>
      <ul>
        <li><h2>Capital:</h2><span>${capital}</span></li>
        <li><h2>Population:</h2><span>${population}</span></li>
        <li><h2>Languages:</h2><span>${languages}</span></li>
      </ul>`;
    })
    .join('');
}

function clearMarkup() {
  countryInfo.innerHTML = '';
  countriesList.innerHTML = '';
}