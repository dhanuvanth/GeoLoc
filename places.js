
const loadPlaces = function(coords) {
  // fetch data from user coords using external APIs, or simply add places data statically
  // please look at GeoAR.js repository on examples/click-places/places.js for full code
  // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY

    const PLACES = [
        {
            name: "Coimbatore",
            location: {
                lat: 11.077452745830913,  // add here latitude if using static data
                lng: 76.93551808077541, // add here longitude if using static data
            }
        },
    ];
  
    return Promise.resolve(PLACES);
}

window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place icon
                    const icon = document.createElement('a-image');
                    icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    icon.setAttribute('name', place.name);
                    icon.setAttribute('src', 'https://cdn.glitch.global/c8be50df-0a7c-4f3c-87e4-1fca75753ac5/Dream_tower_out.jpeg?v=1642833540037');

                    // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
                    icon.setAttribute('scale', '120, 120');

                    icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

                    const clickListener = function(ev) {
                        ev.stopPropagation();
                        ev.preventDefault();
            
                        const name = ev.target.getAttribute('name');
            
                        const el = ev.detail.intersection && ev.detail.intersection.object.el;
            
                        if (el && el === ev.target) {
                            const label = document.createElement('span');
                            const container = document.createElement('div');
                            container.setAttribute('id', 'place-label');
                            label.innerText = name;
                            container.appendChild(label);
                            document.body.appendChild(container);
            
                            setTimeout(() => {
                                container.parentElement.removeChild(container);
                            }, 1500);
                        }
                    };
            
                    icon.addEventListener('click', clickListener);

                    scene.appendChild(icon);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};