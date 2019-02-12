var MapManager = {
    // Api OpenData Lyon key
    velovApi: 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=173528a3f3fadc7f836f750ac92b3ed04c92258b',
    map: null,
    reservationPanel: $('.reservation'),
    stationName: $('.station-name'),
    stationAddress: $('.station-address'),
    availableBikes: $('.available-bikes'),
    infoStationPanel: $('.info-station'),
    reservationButton: $('.reservation-button'),
    submitButton: $('#submit'),
    currentReservMessage: $('.available-bikes'),
    cancelReservation: $('.cancel'),
    timerText: $('.timer-text'),
    userInfo: {
        firstName: "",
        lastName: ""
    },
    x: null,

    // Google Maps Creation, no countdown on footer, call of the velov API
    init: function () {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 45.751827,
                lng: 4.8526,
            },
            zoom: 13,
            minZoom: 11,
            scrollwheel: false
        });
        this.hideCountDownPanel();
        this.callApiVelov();

        var getUserInfo = JSON.parse(localStorage.getItem('userInfo'));


        if (getUserInfo != null) {
            $('#firstName')[0].value = getUserInfo.firstName;
            $('#lastName')[0].value = getUserInfo.lastName;
        }

        var finishDate = sessionStorage.getItem('finishdate')

        if (finishDate != null && finishDate != undefined) {


            var now = new Date().getTime();
            if (now < finishDate) {
                this.countDown();
            }
        }

    },
    // Add a marker clusterer to manage the markers.
    displayMarkerCluster: function (map, markers) {
        var markerCluster = new MarkerClusterer(this.map, markers, {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });
    },

    hideCountDownPanel: function () {
        this.timerText.hide();
        this.cancelReservation.hide();
    },

    hideInfosStation: function () {
        this.reservationPanel.fadeOut();
        this.stationName.hide();
        this.stationAddress.hide();
        this.availableBikes.hide();
    },
    countDown: function (reset) {

        var finishDate = sessionStorage.getItem('finishdate')
        if (finishDate === null || finishDate === undefined || reset === true) {
            finishDate = new Date().getTime() + 1200000; //1200 = 20 minutes
            // Si 'finishdate' n'est pas défini alors l'initialiser avec la ligne du dessus
        } else {
            var now = new Date().getTime();
            if (now > finishDate) {
                finishDate = new Date().getTime() + 1200000;
            }
            // ici finishDate provient du sessionStorage s'assurer que la date retournée n'est pas dépassée auquel cas il faudra réinitialiser le timer
        }
        sessionStorage.setItem('finishdate', finishDate)
        this.x = setInterval(function () {
            var now = new Date().getTime();
            var distance = finishDate - now;
            var seconds = Math.floor((distance % 60000) / 1000)
            var minutes = Math.floor(distance / 60000)
            this.timerText.fadeIn();
            this.timerText.text(minutes + "m " + seconds + "s ");
            if (distance < 0) {
                clearInterval(Map.x);
                this.currentReservMessage.text('Votre réservation a expiré');
                this.timerText.text('');
                localStorage.removeItem('userInfo');
                // Clear session storage here
            }
        }.bind(this), 1000);
    },

    callApiVelov: function () {
        ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=173528a3f3fadc7f836f750ac92b3ed04c92258b", function (reponse) {
            var stations = JSON.parse(reponse);
            markers = [];
            // For each station : we create a marker on the map + we define actions on click on this marker
            //for (var i = 0; i < stations.length; i++) {
            //   var station = stations[i]
            stations.forEach(station => {

                // stations.forEach(function (station) {
                var addresseImage = "/images/velo_dispo.png";
                if (station.status == "OPEN") {
                    if (station.available_bikes == 0) {
                        addresseImage = "/images/no_velo.png"
                    }
                } else {
                    addresseImage = "/images/station_close.png";
                }
                var marker = new google.maps.Marker({
                    position: station.position,
                    map: this.map,
                    title: station.name,
                    icon: {
                        url: addresseImage
                    }
                });
                marker.info = station;
                markers.push(marker);

                // Display infosStations on click on the marker
                marker.addListener('click', function (e) {
                    this.hideInfosStation();
                    this.reservationButton.css('display', 'block');
                    this.stationName.text(station.name);
                    this.stationAddress.text('Adresse : ' + station.address);
                    this.availableBikes.text('Velov(s) disponible(s) : ' + station.available_bikes);
                    this.stationName.fadeIn('slow');
                    this.stationAddress.fadeIn('slow');
                    this.availableBikes.fadeIn('slow');
                    // On click on a marker, smooth scroll to the informations panel for a better experience for mobile devices
                    $('html, body').animate({
                            scrollTop: this.infoStationPanel.offset().top
                        },
                        'slow'
                    );

                    // Display the panel of reservation on click on the reservation button
                    this.reservationButton.click(function () {
                        if (station.available_bikes > 0) {
                            this.reservationPanel.css('display', 'block');
                            this.availableBikes.text('Il y a ' + station.available_bikes + ' velov(s) disponible(s) à réserver !');
                        } else {
                            this.availableBikes.text('Il n\' y a aucun velov disponible à réserver !');
                            this.reservationButton.css('display', 'none');
                            this.reservationPanel.css('display', 'none');
                        }
                        // On click on a marker, smooth scroll to the reservation panel for a better experience for mobile devices
                        $('html, body').animate({
                                scrollTop: this.reservationPanel.offset().top
                            },
                            'slow'
                        );
                    }.bind(this));

                    // Enregistrement du nom pour la réservation
                    this.submitButton.click(function () {

                        this.userInfo.firstName = $('#firstName')[0].value;
                        this.userInfo.lastName = $('#lastName')[0].value;
                        if (this.userInfo.firstName.length == 0) {
                            alert('Merci de remplir votre prénom');
                            return;
                        }
                        if (this.userInfo.lastName.length == 0) {
                            alert('Merci de remplir votre nom');
                            return;
                        }
                        localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
                        sessionStorage.setItem('name', station.name);
                        this.reservationPanel.css('display', 'none');
                        this.reservationButton.css('display', 'none');
                        this.availableBikes.text('Vous avez réservé 1 velov à cette station');
                        this.currentReservMessage.text('Vous avez réservé 1 velov à la station ' + sessionStorage.name);
                        this.cancelReservation.show();
                        // Reset le précédent countdown
                        clearInterval(this.x);
                        // Démarre un nouveau countdown
                        this.countDown(true);

                        // Annulation de la réservation
                        this.cancelReservation.click(function () {
                            clearInterval(this.x);
                            this.currentReservMessage.text('Réservation annulée');
                            this.cancelReservation.hide();
                        }.bind(this))
                    }.bind(this));
                }.bind(this));
            })
            this.displayMarkerCluster(this.map, markers);
        }.bind(this));
    },

}

$(document).ready(function () {
    var mapManager = Object.create(MapManager);
    mapManager.init();
});

////////////////////////////////