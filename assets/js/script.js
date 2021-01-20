// Materialize css Side Navbar
var sideNav = document.querySelector('.sidenav');
var instance = new M.Sidenav(sideNav);
$(document).ready(function() {
    $('.sidenav').sideNav();
});


// Materialize css Slider
var slider = document.querySelector('.slider');
var instance = new M.Slider(slider);
$(document).ready(function() {
    $('.slider').slider({
        full_width: true,
        indicators: false,
        height: 650,
        interval: 6000,
        transition: 500
    });
});

// Materialize Autocomplete
var ac = document.querySelector('.autocomplete');
var instance = new M.Autocomplete(ac);
$(document).ready(function() {
    $('.autocomplete').autocomplete({
        data: {
            "Mexican": null,
            "Margarita": null,
            "Italian": null,
            "Wine": null,
            "Chinese": null
        }
    });
});

// Material Boxed
var mb = document.querySelectorAll('.materialboxed');
var instance = new M.Materialbox(mb);
$(document).ready(function() {
    $('.mb').mb();
});