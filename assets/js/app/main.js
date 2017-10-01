$(document).ready(function(){
    $("#mobile-menu-toggle").on('click', function(){
        $("#Main-Navigation").toggleClass('dark');
    });
    $(".headroom").headroom({offset:768});
});