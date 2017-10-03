$(document).ready(function(){
    $(document).on('click', '[data-videoplayer-src]', function(e){
        e.preventDefault();
        var urlArr = $(this).attr('data-videoplayer-src').split('/');
        var arrlength = urlArr.length;
        if(arrlength <= 0){
            return;
        }
        $('#tehj-video-player #video').attr('src','https://youtube.com/embed/'+ urlArr[arrlength - 1]);
        $('#tehj-video-player').fadeIn(150);
        $('#tehj-video-player').addClass('open');
        $('body').addClass('hide-overflow');
    });

    $(document).on('click', '#tehj-video-player #fullsized_close', function(){
        closeTehjVideoPlayer();
    });

    $(document).keyup(function(e) {
        //var code = e.keyCode || e.which;
        //alert('key pressed: ' + code);
        if (e.keyCode == 27) { // escape key maps to keycode `27`
            closeTehjVideoPlayer();
        }
    });

    var closeTehjVideoPlayer = function(){
        if($('#tehj-video-player').hasClass('open')){
                // $('#tehj-video-player #video').stopVideo();
                $('#tehj-video-player #video').attr('src','');
                $('#tehj-video-player').fadeOut(150);
                setTimeout(function(){
                    $('#tehj-video-player').removeClass('open');
                    $('body').removeClass('hide-overflow');
                }, 150);
            }
    }
});