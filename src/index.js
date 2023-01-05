import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputSearch = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearch.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const searchCountry = e.target.value.trim();
  console.log(searchCountry);
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
        countriesList.innerHTML = markupDiferentCountries(data);
        return;
      }

      if (data.length === 1) {
        console.log(data);
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
  data
    .map(({ name, flags }) => {
      `<li><img src="${flags.svg}" alt="${name}" width='24'/> 
      <span>${name.official}</span></li>`;
    })
    .join('');
}
