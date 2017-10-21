var app = angular.module('app',['firebase']);

app.controller('ctrl_homepage', function($scope, $firebaseObject, $firebaseArray){
    var heroRef = firebase.database().ref("HomePage/Hero");
    // create a synchronized array
    $scope.HeroBanner = $firebaseArray(heroRef);
    $scope.FeaturedImages = [];
    var weddingRef = firebase.database().ref("HomePage/Featured/Weddings");
    $scope.FeaturedImages.weddings = $firebaseObject(weddingRef);
    var banquetRef = firebase.database().ref("HomePage/Featured/Banquets");
    $scope.FeaturedImages.banquets = $firebaseObject(banquetRef);
    var partyRef = firebase.database().ref("HomePage/Featured/Parties");
    $scope.FeaturedImages.parties = $firebaseObject(partyRef);
    var socialRef = firebase.database().ref("HomePage/Featured/SocialEvents");
    $scope.FeaturedImages.socialEvents = $firebaseObject(socialRef);
    var concertRef = firebase.database().ref("HomePage/Featured/Concerts");
    $scope.FeaturedImages.concerts = $firebaseObject(concertRef);
    var seminarRef = firebase.database().ref("HomePage/Featured/Seminars");
    $scope.FeaturedImages.seminars = $firebaseObject(seminarRef);
});

app.controller('ctrl_gallerypage', function($scope, $firebaseObject, $firebaseArray){
    var bannerRef = firebase.database().ref("GalleryPage/BannerImage");
    $scope.BannerImage = $firebaseObject(bannerRef);

    var galleryListRef = firebase.database().ref("Galleries");
    $scope.GalleryList = $firebaseArray(galleryListRef);
});

app.controller('ctrl_albumpage', function($scope, $firebaseObject, $firebaseArray){
    var theAlbumID = GetUrlParameter["aid"];
    $scope.GalleryInfo = "";
    $scope.AlbumImages = [];

    if(!NullOrEmpty(theAlbumID)){
        var galleryInfoRef = firebase.database().ref("Galleries/" + theAlbumID);
        $scope.GalleryInfo = $firebaseObject(galleryInfoRef);

        var albumImagesRef = firebase.database().ref("Photos").orderByChild('GalleryID').equalTo(theAlbumID);
        $scope.AlbumImages = $firebaseArray(albumImagesRef);
    }
});