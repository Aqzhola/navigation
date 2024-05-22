let map, directionsService, directionsRenderer;
let markers = [];

function initMap() {
    const astana = { lat: 51.169392, lng: 71.449074 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: astana
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById('directionsPanel'));

    map.addListener('click', (event) => {
        addMarker(event.latLng);
    });
}

function addMarker(location) {
    if (markers.length >= 2) {
        alert("You can only add two markers.");
        return;
    }
    const marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
    if (markers.length === 2) {
        calculateRoute();
    }
}

function clearMarkers() {
    for (let marker of markers) {
        marker.setMap(null);
    }
    markers = [];
    directionsRenderer.set('directions', null);
    document.getElementById('route-details').style.display = 'none';
}

function calculateRoute() {
    if (markers.length < 2) {
        alert("Please select at least two points on the map.");
        return;
    }
    const start = markers[0].getPosition();
    const end = markers[1].getPosition();
    const request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            document.getElementById('route-details').style.display = 'block';
        } else {
            alert('Directions request failed due to ' + status);
        }
    });
}

function closeRouteDetails() {
    document.getElementById('route-details').style.display = 'none';
}
