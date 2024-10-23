import axios from 'axios';

const script = document.createElement('script');
script.async = true;
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&loading=async&libraries=visualization`;
document.head.appendChild(script);

const form = document.querySelector('form')! as HTMLFormElement;
const addressInput = document.getElementById(
  'search-address'
)! as HTMLInputElement;

type GoogleGeocodingResponse = {
  results: google.maps.GeocoderResult[];
  status: 'OK' | 'ZERO_RESULTS';
};

function searchAddressHandler(event: Event) {
  event.preventDefault();

  const enteredAddress = addressInput.value;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
    enteredAddress
  )}&key=${process.env.GOOGLE_API_KEY}`;

  axios
    .get<GoogleGeocodingResponse>(url)
    .then((response) => {
      if (response.data.status !== 'OK') {
        throw new Error('Could not fetch location.');
      }
      const coordinates = response.data.results[0].geometry.location;
      console.log(coordinates);

      let map: google.maps.Map;
      async function initMap(): Promise<void> {
        const { Map } = (await google.maps.importLibrary(
          'maps'
        )) as google.maps.MapsLibrary;
        map = new Map(document.getElementById('map') as HTMLElement, {
          center: coordinates,
          zoom: 8,
          mapId: 'ourMap1',
        });

        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          'marker'
        )) as google.maps.MarkerLibrary;

        new AdvancedMarkerElement({
          map: map,
          position: coordinates,
          title: 'Uluru',
        });
      }

      initMap();
    })
    .catch((error) => {
      console.log(error);
    });
}

form.addEventListener('submit', searchAddressHandler);
