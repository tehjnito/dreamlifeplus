$(document).ready(function(){
        var $currentImagesTrig = [];
        var $currentImagesURLs = [];
        var $currentImageIndex = -1;

    $(document).on('click', '[data-tehj-gallery]', function(){
        $currentImagesTrig = getGalleryImagesTrig($(this).attr('data-tehj-gallery'));
        $currentImagesURLs = getGalleryImageURLs($currentImagesTrig);
        $currentImageIndex = getCurrentImageIndex($(this).attr('data-tehj-img-url'), $currentImagesURLs);

        if($currentImageIndex > -1){
            openGallery($currentImageIndex, $currentImagesURLs);
        }
    });

    $(document).keyup(function(e) {
        if($currentImageIndex < 0){
            return;
        }
        //var code = e.keyCode || e.which;
        //alert('key pressed: ' + code);
        if (e.keyCode == 27) { // escape key maps to keycode `27`
            closeGallery();
        }
        else if(e.keyCode == 37){
            showGalleryPrev();
        }else if(e.keyCode == 39){
            showGalleryNext();
        }
    });

    $(document).on('click', '#gallery-close', function(){
        closeGallery();
    });

    $(document).on('click', '#gallery-nav-next', function(){
        showGalleryNext();
    });
    $(document).on('click', '#gallery-nav-prev', function(){
        showGalleryPrev();
    });


    var getGalleryImagesTrig = function(_name){
        return $('[data-tehj-gallery='+_name+']');
    }

    var getGalleryImageURLs = function(_array){
        var $galleryURLs = Array();
        for(i = 0; i < _array.length;i++){
            $galleryURLs.push($(_array[i]).attr('data-tehj-img-url'));
        }
        return $galleryURLs;
    }

    var getCurrentImageIndex = function(_element, _array){
        return jQuery.inArray(_element, _array);
    }

    var openGallery = function(_index, _imagesURL){
        $('body').addClass('tehj-gallery-open');
        showGalleryItem(_index, _imagesURL);
    }

    var showGalleryItem = function(_index, _imagesURL){
        console.log("Current Index: "+_index);
        $('#tehjGalleryStart img').attr('src', _imagesURL[_index]);
    }

    var showGalleryPrev = function(){
        $currentImageIndex = ($currentImageIndex-1)%$currentImagesURLs.length;
        $currentImageIndex = ($currentImageIndex < 0)?$currentImagesURLs.length - 1 : $currentImageIndex;
        showGalleryItem($currentImageIndex, $currentImagesURLs);
    }

    var showGalleryNext = function(){
        $currentImageIndex = ($currentImageIndex+1)%$currentImagesURLs.length;
        showGalleryItem($currentImageIndex, $currentImagesURLs);
    }

    var closeGallery = function(){
        $currentImageIndex = -1;
        $currentImagesTrig = [];
        $currentImagesURLs = [];
        $('body').removeClass('tehj-gallery-open');
        $('#tehjGalleryStart img').attr('src',null);
    }
});