$(function(){var saveContainer = $('.save-container'),  favoriteIcon = saveContainer.find('.glyphicon'),  favoriteLocationsListGroup = $('.list-group');
var hasFavoriteLocations = false;
// Initialize a google maps using the gmaps library.
var map = new GMaps({el: '#map', lat: '0', lng: '0', zoom: 1 });
// Initialize the favorite locations array which is kept in localStorage
if(!localStorage.hasOwnProperty('favorite-locations')) {localStorage.setItem('favorite-locations', JSON.stringify([]));}
hasFavoriteLocations = JSON.parse(localStorage.getItem('favorite-locations')).length ? true : false;
// Form submit and Search icon handlers
$('.glyphicon-search').click(showLocationByAddress); $('#geocoding_form').submit(showLocationByAddress);
// Click handler on any of the favorite locations
$(document).on('click','a.list-group-item', showLocationByCoordinates);
// Click handler on the favorite(star) icon to become saved or removed
$(document).on('click', '.glyphicon-star', removeFavoriteLocation);  $(document).on('click', '.glyphicon-star-empty', saveFavoriteLocation);
// If there are any favorite locations, append them to the favorite location list
if(hasFavoriteLocations) {var array = JSON.parse(localStorage.getItem('favorite-locations'));
	favoriteLocationsListGroup.empty();favoriteLocationsListGroup.append('<span class="list-group-item active">Saved Locations</span>');
	array.forEach(function(item){favoriteLocationsListGroup.append('<a class="list-group-item" data-lat="'+item.lat+'" data-lng="'+item.lng+'" data-createdAt="'+item.createdAt+'">'
		+item.address+'<span class="createdAt">'+moment(item.createdAt).fromNow()+'</span><span class="glyphicon glyphicon-menu-right"></span></a>');  });
	favoriteLocationsListGroup.show(); }
    
    function showLocationByAddress(e) {e.preventDefault();// This function presents the address which was entered in the text field in the map
	// Getting the coordinates of the entered address
	GMaps.geocode({address: $('#address').val().trim(), callback: function(results, status) {if (status !== 'OK') return;
		var latlng = results[0].geometry.location, fullAddress = results[0].formatted_address,   isLocationFavorite = false,   locationsArray = JSON.parse(localStorage.getItem('favorite-locations')),
                    saveLocation = $('#save-location');
		var map = new GMaps({el: '#map', lat: latlng.lat(), lng: latlng.lng() });
		map.addMarker({lat: latlng.lat(), lng: latlng.lng()  }); // Adding a marker on the wanted location
		// Checking if this address exists in the favorites array
		if(locationsArray.length) {locationsArray.forEach(function (item) {if (item.lat == latlng.lat() && item.lng == latlng.lng()) {isLocationFavorite = true; }     });   }
			saveLocation.text(fullAddress).attr({'data-lat': latlng.lat(), 'data-lng': latlng.lng()}); // Adding the address to the html and setting data attributes with the coordinates
			favoriteLocationsListGroup.find('a.list-group-item').removeClass('active-location'); // Removing the active class from all favorite locations
			if(!isLocationFavorite) {favoriteIcon.removeClass('glyphicon-star').addClass('glyphicon-star-empty'); } // Changing the icon to become non-favorite
			else {favoriteIcon.removeClass('glyphicon-star-empty').addClass('glyphicon-star'); // Adding the active class and add the favorite icon on the given favorite location
				// Find the entry in the favorite locations list that corresponds to the current location, and mark it as active.
			favoriteLocationsListGroup.find('a.list-group-item[data-lat="'+latlng.lat()+'"][data-lng="'+latlng.lng()+'"]').addClass('active-location');}
		saveContainer.show(); }       });   } // Show the html of the given location

    // This functions is called when a favorite location is clicked. It reads the coordinates and shows them in a map
	function showLocationByCoordinates(e) {e.preventDefault();  var elem = $(this),  location = elem.data();
	// Getting the address from the location's coordinates
	GMaps.geocode({location: {lat: location.lat, lng: location.lng},  callback: function(results, status) {if (status !== 'OK') return;
		var fullAddress = results[0].formatted_address, saveLocation = $('#save-location');
		var map = new GMaps({ el: '#map', lat: location.lat, lng: location.lng });
		map.addMarker({ lat: location.lat, lng: location.lng });
		// Adding the address to the html and setting data attributes with the location's coordinates
		saveLocation.text(fullAddress); saveLocation.attr({ 'data-lat': location.lat, 'data-lng': location.lng  });
		// Adding colored background to the active favorite location and removing the old active location
		favoriteLocationsListGroup.find('a.list-group-item').removeClass('active-location');
		favoriteLocationsListGroup.find('a.list-group-item[data-lat="'+location.lat+'"][data-lng="'+location.lng+'"]').addClass('active-location');
		favoriteIcon.removeClass('glyphicon-star-empty').addClass('glyphicon-star'); // Add the favorite icon on the given location
		saveContainer.show(); // Show the html of the given location
		$('#address').val(''); }  });  } // Clear the search field

    // This function saves a location to favorites and adds it to localStorage
    function saveFavoriteLocation(e){e.preventDefault();
	var saveLocation = $('#save-location'),  locationAddress = saveLocation.text(), isLocationFavorite = false, locationsArray = JSON.parse(localStorage.getItem('favorite-locations'));
	var location = { lat: saveLocation.attr('data-lat'), lng: saveLocation.attr('data-lng'), createdAt: moment().format()  };
	// Checking if this location is in the favorites array
	if(locationsArray.length) {locationsArray.forEach(function (item) { if (item.lat == location.lat && item.lng == location.lng) {isLocationFavorite = true; }  }); }
	// If the given location is not in favorites, add it to the HTML and to localStorage's array
	if(!isLocationFavorite) {favoriteLocationsListGroup.append('<a class="list-group-item active-location" data-lat="'+location.lat+'" data-lng="'+location.lng+'" data-createdAt="'+location.createdAt+'">'+
		locationAddress+'<span class="createdAt">'+moment(location.createdAt).fromNow()+'</span>' +  '<span class="glyphicon glyphicon-menu-right"></span>' +  '</span></a>');
		favoriteLocationsListGroup.show(); locationsArray.push({address: locationAddress, lat: location.lat, lng: location.lng,  createdAt: moment().format()  }); // Adding the given location to the localStorage's array
		localStorage.setItem('favorite-locations', JSON.stringify(locationsArray));
		favoriteIcon.removeClass('glyphicon-star-empty').addClass('glyphicon-star'); // Make the star icon full, to signify that this location is now favorite
		hasFavoriteLocations = true;  }  } // Now we have at least one favorite location
    // This function removes a favorite location from the favorites list and removes it from localStorage
    
    function removeFavoriteLocation(e){e.preventDefault();
	var saveLocation = $('#save-location'),  isLocationDeleted = false, locationsArray = JSON.parse(localStorage.getItem('favorite-locations'));
	var location = { lat: saveLocation.attr('data-lat'), lng: saveLocation.attr('data-lng') };
	// Removing the given location from the localStorage's Array
	if(locationsArray.length) {locationsArray.forEach(function (item, index) {if (item.lat == location.lat && item.lng == location.lng) {locationsArray.splice(index,1);  isLocationDeleted = true; } }); }
        if(isLocationDeleted) {favoriteLocationsListGroup.find('a.list-group-item[data-lat="'+location.lat+'"][data-lng="'+location.lng+'"]').remove(); // Remove the given location from the favorites list
			localStorage.setItem('favorite-locations', JSON.stringify(locationsArray)); favoriteIcon.removeClass('glyphicon-star').addClass('glyphicon-star-empty'); // Removing the favorite icon from the html
			if(!locationsArray.length) { hasFavoriteLocations = false; favoriteLocationsListGroup.hide(); } // There are no more favorite locations
            else { hasFavoriteLocations = true; }   }  }
});