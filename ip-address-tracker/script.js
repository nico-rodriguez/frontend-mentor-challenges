let map;
let marker;

const baseURL =
  'https://geo.ipify.org/api/v2/country,city?apiKey=at_l3Q1hjwbTrLh67nGG5a8u3Pm4wKjo&';

fetch(baseURL)
  .then((response) => {
    return response.json();
  })
  .then(handleAPIResponse)
  .catch((err) => {
    console.error(err);
    alert(
      'Something went wrong. Please disable any ad-blocker or use a different browser.'
    );
  });

const form = document.querySelector('form');
const ipEl = document.querySelectorAll('.ip p')[1];
const locationEl = document.querySelectorAll('.location p')[1];
const timezoneEl = document.querySelectorAll('.timezone p')[1];
const ipsEl = document.querySelectorAll('.isp p')[1];

function handleAPIResponse({ ip, location, isp }) {
  const { country, region, timezone, postalCode, lat, lng } = location;

  if (!map) {
    map = L.map('map', {
      attributionControl: false,
      zoomControl: false,
    }).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      map
    );
    marker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'images/icon-location.svg',
        popupAnchor: [23, 56],
      }),
    })
      .addTo(map)
      .bindPopup('You are here')
      .openPopup();
    setTimeout(() => {
      marker.closePopup();
    }, 5000);
  } else {
    map.setView([lat, lng], 15);
    marker.remove();
    marker = L.marker([lat, lng], {
      icon: L.icon({ iconUrl: 'images/icon-location.svg' }),
    }).addTo(map);
  }

  ipEl.textContent = ip;
  locationEl.textContent = `${region}, ${country} ${postalCode}`;
  timezoneEl.textContent = `UTC ${timezone}`;
  ipsEl.textContent = isp;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const search = event.target.search.value;

  // validate ip or domain name
  const validIP =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const validDomainName =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;

  if (search) {
    const isIP = validIP.test(search);
    const isDomain = validDomainName.test(search);
    if (isIP || isDomain) {
      event.target.reset();
      const url = baseURL + (isIP ? `ipAddress=${search}` : `domain=${search}`);
      fetch(url)
        .then((response) => response.json())
        .then(handleAPIResponse);
    } else {
      alert(`${search} does not have a valid IP address or domain name format`);
    }
  }
});
