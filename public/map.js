
var apiKey = 'AIzaSyA2SaE0hVuXOTHiDEMZ3pMGKakgako5iB8';

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.088753073010125, lng: 71.42456369665425 },
        zoom: 15
    });

    fetch('http://localhost:3000/location')
        .then(response => response.json())
        .then(data => {
            var latitude = data.latitude;
            var longitude = data.longitude;

            var markerIcon = {
                url: 'location.png',
                scaledSize: new google.maps.Size(30, 30)
            };

            var marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                title: 'University',
                icon: markerIcon
            });

            // Center the map on the marker
            map.setCenter(marker.getPosition());
        })
        .catch(error => console.error('Error fetching JSON data:', error));
}

function loadMapScript() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=initMap';
    document.body.appendChild(script);
}

loadMapScript();
