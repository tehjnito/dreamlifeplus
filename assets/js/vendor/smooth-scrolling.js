$(document).ready(function(){
    $(document).on('click', '[href*=#]:not([href=#]):not([data-toggle])', function(){
    //$('a[href*=#]:not([href=#]):not([data-toggle])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
        || location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
           if (target.length) {
             $('html,body').animate({
                 scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }else{
        alert("else block");
    }
});
});