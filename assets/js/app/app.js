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
    var socialRef = firebase.database().ref("HomePage/Featured/Socials");
    $scope.FeaturedImages.socialEvents = $firebaseObject(socialRef);
    var concertRef = firebase.database().ref("HomePage/Featured/Concerts");
    $scope.FeaturedImages.concerts = $firebaseObject(concertRef);
    var seminarRef = firebase.database().ref("HomePage/Featured/Seminars");
    $scope.FeaturedImages.seminars = $firebaseObject(seminarRef);
});

app.controller('ctrl_gallerypage', function($scope, $firebaseObject, $firebaseArray){
    var bannerRef = firebase.database().ref("GalleryPage/Banner");
    $scope.BannerImage = $firebaseObject(bannerRef);

    var albumListRef = firebase.database().ref("Albums");
    $scope.AlbumList = $firebaseArray(albumListRef);
});

app.controller('ctrl_albumpage', function($scope, $firebaseObject, $firebaseArray){
    var theAlbumID = GetUrlParameter["aid"];
    $scope.AlbumInfo = "";
    $scope.AlbumImages = [];

    if(!NullOrEmpty(theAlbumID)){
        var albumInfoRef = firebase.database().ref("Albums/" + theAlbumID);
        $scope.AlbumInfo = $firebaseObject(albumInfoRef);

        var albumImagesRef = firebase.database().ref("Photos").orderByChild('AlbumID').equalTo(theAlbumID);
        $scope.AlbumImages = $firebaseArray(albumImagesRef);
    }
});