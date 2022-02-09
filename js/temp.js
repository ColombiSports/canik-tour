$(document).ready(function() {
    'use strict';

    var window_width = $(window).width(),
        window_height = window.innerHeight,
        header_height = $('.default-header').height(),
        header_height_static = $('.site-header.static').outerHeight(),
        fitscreen = window_height - header_height;

    $('.fullscreen').css('height', window_height);
    $('.fitscreen').css('height', fitscreen);

    function fixLength(number) {
        return ('0' + number).slice(-2);
    }

    // Set the date we're counting down
    var opening = new Date('Sept 5, 2018 12:00:00').getTime();
    createTimer(document.getElementById('opening'), opening);

    // Create a timer and update the countdown every second
    function createTimer(element, to) {
        // Find the distance between now an the countdown date
        var now = new Date().getTime();
        var distance = to - now;

        // If the countdown is over, say it
        if (distance < 0) {
            clearInterval(id);
            element.innerHTML = 'EXPIRÉ';

            // Show count down in french
        } else {
            // Stock interval ID
            var id = setInterval(function() {
                // Find the distance between now an the countdown date
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Output the result in a html element
                element.innerHTML =
                    '<p> ' +
                    fixLength(days) +
                    '<span> jours  </span>: ' +
                    fixLength(hours) +
                    '<span> heures</span>: ' +
                    fixLength(minutes) +
                    '<span> minutes  </span>: ' +
                    fixLength(seconds) +
                    '<span> secondes  </span></p>';

                distance = to - new Date().getTime();
            }, 1000);
            return id;
        }
    }
});