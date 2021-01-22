$(document).ready(function() {

    // Image slider
    $('.slider').slider({
        full_width: true,
        'height': 500
    });

    // Sidenav for mobile screens
    $('.sidenav').sidenav();

    // Materialbox zoom feature for gallery images
    $('.materialboxed').materialbox();

    // Autocomplete for search box
    // $('.autocomplete').autocomplete({
    //     data: {
    //         "Mexican": null,
    //         "Margarita": null,
    //         "Italian": null,
    //         "Wine": null,
    //         "Chinese": null
    //     }
    // });

});