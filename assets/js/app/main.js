$(document).ready(function(){
    $("#mobile-menu-toggle").on('click', function(){
        $("#Main-Navigation").toggleClass('dark');
    });
    $(".headroom").headroom({offset:768});
});

$(window).on("load", function() {
   if($('.fullsizable').length > 0){
       $('.fullsizable').waitForImages(function(){
            $('.albumn-list.fullsizable [href]').fullsizable({
                detach_id: 'body-wrapper',
                clickBehaviour: 'next',
                preload: true,
                reloadOnOpen: true
            });
       });
    }
});

window.onbeforeunload = function(e) {
    e.preventDefualt();
    location.reload(true);
}


var NullOrEmpty = function (_val) {
    return (_val != null && _val != "") ? false : true;
}

var GetUrlParameter = (function (a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));