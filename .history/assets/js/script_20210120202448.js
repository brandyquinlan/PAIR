// Materialize css Side Navbar
$(document).ready(function() {
    var sideNav = document.querySelector(".sidenav");
    var instance = new M.Sidenav('.sidenav');
    $('.sidenav').sideNav();
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