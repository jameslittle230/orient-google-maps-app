function makePage(data, beforeData) {
    var restaurantData = data;
    var htmlBefore = beforeData;
    var currentMapView = null;

    var bowdoinCoords = {
        lat: 43.9067324,
        lng: -69.965982
    };

    function initMap() {
        var map;

        // Array of colors and things to make the map look pretty
        var styles = [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#444444"
            }]
        }, {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
                "color": "#f2f2f2"
            }]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#eae9ed"
            }]
        }, {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#d2e0b7"
            }]
        }, {
            "featureType": "landscape.natural.landcover",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#d2e0b7"
            }]
        }, {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#d2e0b7"
            }]
        }, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 45
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#ffffff"
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                "color": "#b3dced"
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#ffffff"
            }]
        }, {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "off"
            }, {
                "color": "#e6e6e6"
            }]
        }];

        // Create a new StyledMapType object, passing it the array of styles,
        // as well as the name to be displayed on the map type control.
        var styledMap = new google.maps.StyledMapType(styles, {
            name: "Styled Map"
        });

        // Create a map object, and include the MapTypeId to add
        // to the map type control.
        var mapOptions = {
            zoom: 12,
            center: bowdoinCoords,
            disableDefaultUI: true,
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };

        map = new google.maps.Map(document.getElementById('map'),
            mapOptions);

        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        return map;
    }

    var map = initMap();

    function createHomeMarker(map) {
        var marker = new google.maps.Marker({
            position: bowdoinCoords,
            map: map,
            title: 'Hello World!'
        });

        return marker;
    }

    function createHomeInfoWindow(map, marker) {
        var contentString = '<div class="maps-bubble-content">' +
            '<img src="img/bowdoin.png"></img>' +
            '<div class="maps-bubble-blurb">' +
            '<h1>Bowdoin College</h1>' +
            '<p>Home Sweet Home</p>' +
            '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            // maxWidth: 200
        });

        infowindow.open(map, marker);
        map.panBy(0, -75);

        return infowindow;
    }

    var homeMarker = createHomeMarker(map);
    var homeInfoWindow = createHomeInfoWindow(map, homeMarker);

    function addHomeMarkerClick(map, marker, infowindow) {
        marker.addListener('click', function() {
            centerToHome(map);
        });
    }

    addHomeMarkerClick(map, homeMarker, homeInfoWindow);

    function closeAllInfoWindows(map) {
        homeInfoWindow.close();
        for (var i = 0; i < restaurantData.length; i++) {
            restaurantData[i].infoWindow.close();
        }
    }

    function centerToHome(map) {
        var pips = document.getElementsByClassName('pip');
        for (var i = 0; i < pips.length; i++) {
            pips[i].classList.remove('pip-active');
            pips[i].classList.add('pip-inactive');
        }

        closeAllInfoWindows();
        homeInfoWindow.open(map, homeMarker);
        map.panTo(bowdoinCoords);
        map.panBy(0, -75);
    }

    function panToMarker(map, id) {
        currentMapView = id;
        var pips = document.getElementsByClassName('pip');
        for (var i = 0; i < pips.length; i++) {
            pips[i].classList.remove('pip-active');
            pips[i].classList.add('pip-inactive');
        }

        var pip = document.getElementById('pip-' + id);
        pip.classList.add('pip-active');
        pip.classList.remove('pip-inactive');

        closeAllInfoWindows(map);
        var marker = restaurantData[id].marker;
        restaurantData[id].infoWindow.open(map, marker);
        map.panTo(restaurantData[id].coords);
        map.panBy(0, -75);
    }

    function rightMapButtonPressed(map) {
        if (currentMapView === null) {
            currentMapView = 0;
        } else {
            currentMapView++;
        }

        if (currentMapView == restaurantData.length) {
            currentMapView = 0;
        }

        panToMarker(map, currentMapView);

        console.log(currentMapView);
    }

    function leftMapButtonPressed(map) {
        if (currentMapView === null) {
            currentMapView = restaurantData.length - 1;
        } else {
            currentMapView--;
        }

        if (currentMapView == -1) {
            currentMapView = restaurantData.length - 1;
        }

        panToMarker(map, currentMapView);

        console.log(currentMapView);
    }

    function addControls(map) {
        function RightControl(controlDiv, map) {

            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.className = controlUI.className +
                " maps-button-exterior maps-button-exterior-right";
            controlUI.title = 'Click to recenter the map';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.className = controlText.className +
                " maps-button-interior maps-button-interior-right";
            controlText.innerHTML = '<i class="fa fa-chevron-right"></i>';
            controlUI.appendChild(controlText);

            // Setup the click event listeners: simply set the map to Chicago.
            controlUI.addEventListener('click', function() {
                rightMapButtonPressed(map);

            });
        }

        function LeftControl(controlDiv, map) {

            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.className = controlUI.className +
                " maps-button-exterior maps-button-exterior-left";
            controlUI.title = 'Click to recenter the map';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.className = controlText.className +
                " maps-button-interior maps-button-interior-left";
            controlText.innerHTML = '<i class="fa fa-chevron-left"></i>';
            controlUI.appendChild(controlText);

            // Setup the click event listeners: simply set the map to Chicago.
            controlUI.addEventListener('click', function() {
                leftMapButtonPressed(map);
            });

        }

        function CenterControl(controlDiv, map) {

            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.className = controlUI.className +
                " maps-button-exterior maps-button-exterior-center";
            controlUI.title = 'Click to recenter the map';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.className = controlText.className +
                " maps-button-interior maps-button-interior-center";
            controlText.innerHTML = 'Back to Bowdoin';
            controlUI.appendChild(controlText);

            // Setup the click event listeners: simply set the map to Chicago.
            controlUI.addEventListener('click', function() {
                closeAllInfoWindows();
                centerToHome(map);
            });

        }

        function BottomControl(controlDiv, map) {

            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.className = controlUI.className +
                " maps-button-exterior maps-button-exterior-bottom";
            controlUI.title = 'Click to recenter the map';
            controlDiv.appendChild(controlUI);

            var bottomControlString = "";
            for (var i = 0; i < restaurantData.length; i++) {
                bottomControlString += '<span class="pip pip-inactive"' +
                    ' id="pip-' + i + '" onclick="makePage.panToMarker(map, ' +
                    i + ')">&bullet;</span>';
            }

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.className = controlText.className +
                " maps-button-interior maps-button-interior-bottom";
            controlText.innerHTML = bottomControlString;
            controlUI.appendChild(controlText);
        }

        var rightControlDiv = document.createElement('div');
        var rightControl = new RightControl(rightControlDiv, map);

        rightControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(rightControlDiv);

        var leftControlDiv = document.createElement('div');
        var leftControl = new LeftControl(leftControlDiv, map);

        leftControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.LEFT_CENTER].push(leftControlDiv);

        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

        var bottomControlDiv = document.createElement('div');
        var bottomControl = new BottomControl(bottomControlDiv, map);

        bottomControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(bottomControlDiv);
    }

    addControls(map);

    function markerClicked(id) {
        console.log(id);
    }

    function addRestaurantMarkers(map, data) {
        for (var i = 0; i < data.length; i++) {
            var newMarker = new google.maps.Marker({
                position: data[i].coords,
                map: map,
                title: 'Hello World!'
            });

            data[i].marker = newMarker;

            contentString = '<div class="maps-bubble-content">' +
                '<img src="' + data[i].imgsrc + '"></img>' +
                '<div class="maps-bubble-blurb">' +
                '<h1>' + data[i].name + '</h1>' +
                '<p>' + data[i].blurb + '</p>' +
                '<p><a class="smooth" href="#' + data[i].slug +
                '">Read More Below</a></p>' +
                '</div>' +
                '</div>';

            var newInfoWindow = new google.maps.InfoWindow({
                content: contentString,
                // maxWidth: 200
            });

            data[i].infoWindow = newInfoWindow;
        }

        return data;
    }

    restaurantData = addRestaurantMarkers(map, restaurantData);

    function addMarkerListeners(map, id) {
        restaurantData[id].marker.addListener('click', function() {
            panToMarker(map, id);
        });
    }

    for (var i = 0; i < restaurantData.length; i++) {
        addMarkerListeners(map, i);
    }

    function fillBodyText(data) {
        var contentDiv = document.getElementById('content');
        for (var i = 0; i < data.length; i++) {
            contentString = "";

            for (var j = 0; j < htmlBefore.length; j++) {
                if (htmlBefore[j].slug == data[i].slug) {
                    contentString += htmlBefore[j].content;
                }
            }

            contentString += '<h2 class="restaurant-title" id="' + data[i].slug +
                '">' + data[i].name + '</h2>' +
                '<img class="restaurant-image" src="' + data[i].imgsrc + '">' +
                data[i].description +
                '<p><a href="#" class="smooth map-link">Back to Map</a>';

            content.innerHTML += contentString;
        }
    }

    fillBodyText(restaurantData);

    function removeLoadingSpinner() {
        document.getElementById('loading').style.display = "none";
        document.getElementById('map').style.opacity = "1";
        document.getElementById('content').style.display = "block";
    }

    setTimeout(removeLoadingSpinner, 1500);
}

/**
 * The data that fills the page with content.
 *
 * Name: The name of the restaurant
 * Slug: A lowercase alphanumeric unique string that represents the restaurant
 * Coords: An object that holds the latitude (lat) and longitude (lng) of the restaurant
 * ImgSrc: The path to the image that represents the restaurant.
 * Blurb: The few lines of text that show up on the Google Map info box
 * Description: The many lines of text that show up lower on the page
 */

var restaurantData = [{
    'name': "Gelato Fiasco",
    'slug': "rest1",
    'coords': {
        lat: 43.90709,
        lng: -69.9357816
    },
    'imgsrc': "img/kitten1.jpg",
    'blurb': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.",
    'description': "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.</p><p>Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis. Quisque mi metus, ornare sit amet fermentum et, tincidunt et orci. Fusce eget orci a orci congue vestibulum. Ut dolor diam, elementum et vestibulum eu, porttitor vel elit. Curabitur venenatis pulvinar tellus gravida ornare. Sed et erat faucibus nunc euismod ultricies ut id justo. Nullam cursus suscipit nisi, et ultrices justo sodales nec. Fusce venenatis facilisis lectus ac semper. Aliquam at massa ipsum. Quisque bibendum purus convallis nulla ultrices ultricies. Nullam aliquam, mi eu aliquam tincidunt, purus velit laoreet tortor, viverra pretium nisi quam vitae mi. Fusce vel volutpat elit. Nam sagittis nisi dui.</p>",
    "marker": null,
    "infoWindow": null,
}, {
    'name': "Restaurant 2",
    'slug': "rest2",
    'coords': {
        lat: 43.89709,
        lng: -69.9357816
    },
    'imgsrc': "img/kitten1.jpg",
    'blurb': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.",
    'description': "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.</p><p>Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis. Quisque mi metus, ornare sit amet fermentum et, tincidunt et orci. Fusce eget orci a orci congue vestibulum. Ut dolor diam, elementum et vestibulum eu, porttitor vel elit. Curabitur venenatis pulvinar tellus gravida ornare. Sed et erat faucibus nunc euismod ultricies ut id justo. Nullam cursus suscipit nisi, et ultrices justo sodales nec. Fusce venenatis facilisis lectus ac semper. Aliquam at massa ipsum. Quisque bibendum purus convallis nulla ultrices ultricies. Nullam aliquam, mi eu aliquam tincidunt, purus velit laoreet tortor, viverra pretium nisi quam vitae mi. Fusce vel volutpat elit. Nam sagittis nisi dui.</p>",
    "marker": null,
    "infoWindow": null,
}, {
    'name': "Restaurant 3",
    'slug': "rest3",
    'coords': {
        lat: 43.999709,
        lng: -69.9957816
    },
    'imgsrc': "img/kitten1.jpg",
    'blurb': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.",
    'description': "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.</p><p>Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis. Quisque mi metus, ornare sit amet fermentum et, tincidunt et orci. Fusce eget orci a orci congue vestibulum. Ut dolor diam, elementum et vestibulum eu, porttitor vel elit. Curabitur venenatis pulvinar tellus gravida ornare. Sed et erat faucibus nunc euismod ultricies ut id justo. Nullam cursus suscipit nisi, et ultrices justo sodales nec. Fusce venenatis facilisis lectus ac semper. Aliquam at massa ipsum. Quisque bibendum purus convallis nulla ultrices ultricies. Nullam aliquam, mi eu aliquam tincidunt, purus velit laoreet tortor, viverra pretium nisi quam vitae mi. Fusce vel volutpat elit. Nam sagittis nisi dui.</p>",
    "marker": null,
    "infoWindow": null,
}, {
    'name': "Restaurant 4",
    'slug': "rest4",
    'coords': {
        lat: 42.89709,
        lng: -69.9357816
    },
    'imgsrc': "img/kitten1.jpg",
    'blurb': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.",
    'description': "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.</p><p>Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis. Quisque mi metus, ornare sit amet fermentum et, tincidunt et orci. Fusce eget orci a orci congue vestibulum. Ut dolor diam, elementum et vestibulum eu, porttitor vel elit. Curabitur venenatis pulvinar tellus gravida ornare. Sed et erat faucibus nunc euismod ultricies ut id justo. Nullam cursus suscipit nisi, et ultrices justo sodales nec. Fusce venenatis facilisis lectus ac semper. Aliquam at massa ipsum. Quisque bibendum purus convallis nulla ultrices ultricies. Nullam aliquam, mi eu aliquam tincidunt, purus velit laoreet tortor, viverra pretium nisi quam vitae mi. Fusce vel volutpat elit. Nam sagittis nisi dui.</p>",
    "marker": null,
    "infoWindow": null,
}];





/**
 * An array of objects that represent bits of HTML that go before
 * different restaurants in the full text.
 *
 * Slug: The slug of the restaurant (see above) that the content should go before
 * Content: The HTML content that goes before the restaurant.
 */

var htmlBefore = [{
    "slug": "rest1",
    "content": "<h1>Eat</h1>"
}, {
    "slug": "rest2",
    "content": "<h1>Do</h1>"
}];

makePage(restaurantData, htmlBefore);

smoothScroll.init({
    selector: '.smooth', // Selector for links (must be a valid CSS selector)
    speed: 500, // Integer. How fast to complete the scroll in milliseconds
    easing: 'easeInOutCubic', // Easing pattern to use
    updateURL: false, // Boolean. Whether or not to update the URL with the anchor hash on scroll
    offset: 10, // Integer. How far to offset the scrolling anchor location in pixels
});
