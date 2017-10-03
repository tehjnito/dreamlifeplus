$(document).ready(function(){
    $("#mobile-menu-toggle").on('click', function(){
        $("#Main-Navigation").toggleClass('dark');
    });
    $(".headroom").headroom({offset:768});
    if($('.fullsizable').length > 0){
        $('.albumn-list.fullsizable a').fullsizable({
            detach_id: 'body-wrapper',
            clickBehaviour: 'next'
        });
    }
});