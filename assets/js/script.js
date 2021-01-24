$(document).ready(function() {
    // Image slider
    $('.slider').slider({
        full_width: true,
        'height': 500
    });

    // Initialize modal
    $('.modal').modal();

    // Sidenav for mobile screens
    $('.sidenav').sidenav();

    // Materialbox zoom feature for gallery images
    $('.materialboxed').materialbox();
});