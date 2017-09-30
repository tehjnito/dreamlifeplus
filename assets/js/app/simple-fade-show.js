$(document).ready(function(){
    $('[data-zoom-fade-show]').initialize(function(){
        var $tempSlide = $(this).last();
        setInterval(function() {
            $tempSlide = $('[data-zoom-fade-show] > :last-child');
            $tempSlide.prependTo($tempSlide.parent());
        }, $(this).attr('data-change-speed'));
    });
});