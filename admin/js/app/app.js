var appAdmin = angular.module('appAdmin',['firebase','ngFileUpload']);

appAdmin.controller('ctrl_admin_albums', function($scope, $firebaseObject, $firebaseArray, $firebaseStorage){
    $scope.Albums = [];
    $scope.AlbumImages = [];
    $scope.aEdit = {Name: ""};
    $scope.CurrentEditAlbum = "";


    $scope.setEditAlbum = function(_val) {
        $scope.CurrentEditAlbum = _val;
        $scope.aEdit.Name = _val.Name;
        $scope.AlbumImages = $firebaseArray(firebase.database().ref("Photos").orderByChild("AlbumID").equalTo(_val.$id));
    };

    var albumListRef = firebase.database().ref("Albums");
    $scope.Albums = $firebaseArray(albumListRef);

    $scope.updateAlbumName = function(){
        var albumInfoRef = firebase.database().ref("Albums/" + $scope.CurrentEditAlbum.$id);
        var AlbumInfo = $firebaseObject(albumInfoRef);

        AlbumInfo.$loaded().then(function(){
            AlbumInfo.Name = $scope.aEdit.Name;

            AlbumInfo.$save().then(function(ref) {
                    // ref.key === AlbumInfo.$id; // true
                }, function(error) {
                console.log("Error:", error);
            })
        });
    };

    var fileStrings = [];

    $scope.uploadImages = function(){
        var files = document.querySelector('input[type=file]#inp_NewImages').files;
        if(files.length > 0 && fileStrings.length == files.length){
            if(confirm("You are about to upload "+files.length + " images.\nContinue?")){
                var photoListRef = $firebaseArray(firebase.database().ref("Photos"));
                // var storageRef = $firebaseStorage(firebase.storage().ref("photos/albumpics/" + ($scope.CurrentEditAlbum.$id.toString() + Math.floor(Date.now()).toString())));
                var count = errorCount = 0;
                
                angular.forEach(files, function(value,key){
                    var tempImageName = ($scope.CurrentEditAlbum.$id.toString() + "_" + key.toString() + "_" + Math.floor(Date.now()).toString());
                    var storageRef = $firebaseStorage(firebase.storage().ref("photos/albumpics/" + tempImageName));
                    var uploadTask = storageRef.$putString(fileStrings[key], "data_url", {contentType: value.type});
                    uploadTask.$complete(function(snapshot){
                        photoListRef.$add({AlbumID: $scope.CurrentEditAlbum.$id, ImageTitle: tempImageName, Image: snapshot.downloadURL}).then(function(ref){
                            count++;  
                        });
                    });
                    uploadTask.$error(function(error){
                        alert("Error in uploading Photos");
                        errorCount++;
                    });
                });
                // for(var i = 0; i < files.length;i++){
                //     var tempImageName = ($scope.CurrentEditAlbum.$id.toString() + "_" + i.toString() + "_" + Math.floor(Date.now()).toString());
                //     var storageRef = $firebaseStorage(firebase.storage().ref("photos/albumpics/" + tempImageName));
                //     var uploadTask = storageRef.$putString(fileStrings[i], "data_url", {contentType: files[i].type});
                //     uploadTask.$complete(function(snapshot){
                //         photoListRef.$add({AlbumID: $scope.CurrentEditAlbum.$id, ImageTitle: tempImageName, Image: snapshot.downloadURL}).then(function(ref){
                //             count++;  
                //         });
                //     });
                //     uploadTask.$error(function(error){
                //         alert("Error in uploading Photos");
                //         errorCount++;
                //     });

                //     if(errorCount > 0){
                //         break;
                //     }
                // }

                // if(count == files.length){
                //     alert("Photos uploaded Successfully");
                // }else{
                //     alert("Some photos were not uploaded!");
                // }
            }
        }
    };

    var uploadInterval = null;

    $scope.uploadInputChange = function(){
        var files = document.querySelector('input[type=file]#inp_NewImages').files;
        fileStrings = [];

        function readAndPreview(file) {
            // Make sure `file.name` matches our extensions criteria
            if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
                var reader = new FileReader();

                reader.addEventListener("load", function () {
                    fileStrings.push(this.result);
                }, false);

                reader.readAsDataURL(file);
            }

        }

        if (files) {
            uploadInterval = setInterval(function(){
                if(fileStrings.length == files.length){
                    console.log("New Array length: "+fileStrings.length);
                    clearInterval(uploadInterval);
                }
            },500);

            // [].forEach.call(files, readAndPreview);
            for(var i = 0; i < files.length; i++){
                readAndPreview(files[i]);
            }
            // setTimeout(function(){
            //     console.log("New Array length: "+fileStrings.length);
            // },5000)
        }
    };

    $scope.deleteFromAlbum = function(_val) {
        if(confirm("You are about to delete this item from the album.\nThis action is irreversible.\nAre You Sure?")){
            var storageRef = $firebaseStorage(firebase.storage().ref("photos/albumpics/"+ _val.ImageTitle));
            storageRef.$delete().then(function(){
                var photoRef = $firebaseObject(firebase.database().ref("Photos").orderByChild("AlbumID").equalTo(_val.AlbumID));
                photoRef.$remove().then(function(ref){
                    alert("Image Deleted");
                });
            }).catch(function(error){});

            // $scope.AlbumImages.$remove(_val).then(function(ref){
            //     if(ref.key == _val.$id){
            //         alert("Removed Successfully");
            //     }else{
            //         alert("Failed to Remove the Record");
            //     }
            // });
        }
    };

    $scope.submitNewAlbum = function(_val){
        _val["display"] = newAlbumDisplay;
        _val["banner"] = newAlbumBanner;
        console.log(_val);

        var listRef = $firebaseArray(firebase.database().ref("Albums"));
        listRef.$add({Name: _val.name, DisplayImage: _val.display, BannerImage: _val.banner}).then(function(ref){
            alert("Completed!");
        });
    };

    var newAlbumDisplay = "";
    var newAlbumBanner = "";

    $scope.newAlbumDisplayUpload = function(){
        var file = document.querySelector('input[type=file]#inp_na_display').files;
        file = file[0];
        // Make sure `file.name` matches our extensions criteria
            if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
                var reader = new FileReader();

                reader.addEventListener("load", function () {
                    newAlbumDisplay = this.result;
                }, false);

                reader.readAsDataURL(file);
            }
    };

    $scope.newAlbumBannerUpload = function(){
        var file = document.querySelector('input[type=file]#inp_na_banner').files;
        file = file[0];
        // Make sure `file.name` matches our extensions criteria
            if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
                var reader = new FileReader();

                reader.addEventListener("load", function () {
                    newAlbumBanner = this.result;
                }, false);

                reader.readAsDataURL(file);
            }
    };

    $scope.deleteAlbum = function(){
        var delCount = 0;
        var photoListRef = $firebaseArray(firebase.database().ref("Photos").orderByChild("AlbumID").equalTo($scope.CurrentEditAlbum.$id));
        photoListRef.$loaded().then(function(){

            angular.forEach(photoListRef, function(value, key){
                var storageRef = $firebaseStorage(firebase.storage().ref("photos/albumpics/"+ value.ImageTitle));
                storageRef.$delete().then(function(){
                    photoListRef.$remove(value).then(function(ref){
                        if(ref.key == value.$id){
                            delCount++;
                        }
                        if(delCount == photoListRef.length){
                            var delAblbumRef = $firebaseObject(firebase.database().ref("Albums").child($scope.CurrentEditAlbum.$id));
                            delAblbumRef.$remove().then(function(ref){
                                alert("Album Deleted Successfully");
                                location.reload(true);
                            }, function(error){
                                alert("Failed to Remove Album: "+error);
                            });
                        }
                    });
                }).catch(function(error){});
            });
        });
    };
    
});

appAdmin.controller('ctrl_admin_homepage', function($scope, $firebaseObject, $firebaseArray, $firebaseStorage){
    $scope.HeroImages = [];

    var heroListRef = firebase.database().ref("HomePage/Hero");
    $scope.HeroImages = $firebaseArray(heroListRef);

    $scope.setHomePageHero = function(){};



    var files = []
    var newPics = [];

    $scope.readHeroImages = function(){
        files = document.querySelector('input[type=file]#inp_heroNewImages').files;
        newPics = [];
        function readAndPreview(file) {
            // Make sure `file.name` matches our extensions criteria
            if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
                var reader = new FileReader();

                reader.addEventListener("load", function () {
                    newPics.push(this.result);
                }, false);

                reader.readAsDataURL(file);
            }
        };

        angular.forEach(files, function(value, key){
            readAndPreview(value);
        });
    };


    $scope.uploadHeroImages = function(){

        if(files.length == newPics.length){
            if(confirm("You are about to upload "+files.length + " images.\nContinue?")){
                var photoListRef = $firebaseArray(firebase.database().ref("HomePage/Hero"));
                
                angular.forEach(files, function(value,key){
                    var tempImageName = ("HeroBanner_" + key.toString() + "_" + Math.floor(Date.now()).toString());
                    var storageRef = $firebaseStorage(firebase.storage().ref("photos/staticpages/" + tempImageName));
                    var uploadTask = storageRef.$putString(newPics[key], "data_url", {contentType: value.type});
                    uploadTask.$complete(function(snapshot){
                        photoListRef.$add({ImageTitle: tempImageName, Image: snapshot.downloadURL}).then(function(ref){
                            alert("Upload Complete");
                        });
                    });
                    uploadTask.$error(function(error){
                        alert("Error in uploading Photos");
                    });
                    uploadTask.$progress(function(snapshot) {
                    var percentUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(percentUploaded);
                    });
                });
            }
        }
    };

    $scope.removeFromHero = function(_val) {
        var storageRef = $firebaseStorage(firebase.storage().ref("photos/staticpages/"+ _val.ImageTitle));
        storageRef.$delete().then(function(){
            var photoRef = $firebaseObject(firebase.database().ref("HomePage/Hero").orderByChild("ImageTitle").equalTo(_val.ImageTitle));
            photoRef.$remove().then(function(ref){
                alert("Image Deleted");
            });
        }).catch(function(error){});
    };

    $scope.Featured = $firebaseArray(firebase.database().ref("HomePage/Featured"));

    $scope.featuresUpload = function(_cat) {
        var tempImageName = "";
        var storageRef = null;
        var file = null;
        var featuresRef = null;

        switch(_cat.toUpperCase()){
            case 'WEDDINGS':
                tempImageName = "HomePageFeature_WEDDINGS";
                storageRef = $firebaseStorage(firebase.storage().ref("photos/staticpages/" + tempImageName));
                file = document.querySelector('input[type=file]#inp_featuresWeddings').files[0];
                featuresRef = $firebaseObject(firebase.database().ref("HomePage/Featured/Weddings"));
            break;
            case 'BANQUETS':
                tempImageName = "HomePageFeature_BANQUETS";
                storageRef = $firebaseStorage(firebase.storage().ref("photos/staticpages/" + tempImageName));
                file = document.querySelector('input[type=file]#inp_featuresBanquets').files[0];
                featuresRef = $firebaseObject(firebase.database().ref("HomePage/Featured/Banquets"));
            break;
            case 'CONCERTS':
                tempImageName = "HomePageFeature_CONCERTS";
                storageRef = $firebaseStorage(firebase.storage().ref("photos/staticpages/" + tempImageName));
                file = document.querySelector('input[type=file]#inp_featuresConcerts').files[0];
                featuresRef = $firebaseObject(firebase.database().ref("HomePage/Featured/Concerts"));
            break;
            case 'PARTIES':
                tempImageName = "HomePageFeature_PARTIES";
                storageRef = $firebaseStorage(firebase.storage().ref("photos/staticpages/" + tempImageName));
                file = document.querySelector('input[type=file]#inp_featuresParties').files[0];
                featuresRef = $firebaseObject(firebase.database().ref("HomePage/Featured/Parties"));
            break;
            case 'SOCIALS':
                tempImageName = "HomePageFeature_SOCIALS";
                storageRef = $firebaseStorage(firebase.storage().ref("photos/staticpages/" + tempImageName));
                file = document.querySelector('input[type=file]#inp_featuresSocials').files[0];
                featuresRef = $firebaseObject(firebase.database().ref("HomePage/Featured/Socials"));
            break;
            case 'SEMINARS':
                tempImageName = "HomePageFeature_SEMINARS";
                storageRef = $firebaseStorage(firebase.storage().ref("photos/staticpages/" + tempImageName));
                file = document.querySelector('input[type=file]#inp_featuresSeminars').files[0];
                featuresRef = $firebaseObject(firebase.database().ref("HomePage/Featured/Seminars"));
            break;
        }

        if(file == null){
            alert("No Image Selected");
            return;
        }

        
        var uploadTask = storageRef.$put(file, {contentType: file.type});
        uploadTask.$complete(function(snapshot){
            featuresRef.$loaded().then(function(){
                featuresRef.Image = snapshot.downloadURL;
                featuresRef.$save().then(function(ref) {
                    // ref.key === AlbumInfo.$id; // true
                }, function(error) {
                console.log("Error:", error);
            })
            });
        });
        uploadTask.$error(function(error){
            alert("Error in uploading Photos");
        });
        uploadTask.$progress(function(snapshot) {
            var percentUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(percentUploaded);
        });
    };

});

appAdmin.controller('ctrl_admin_gallerypage', function($scope, $firebaseObject, $firebaseArray, $firebaseStorage){
    $scope.BannerImage = $firebaseObject(firebase.database().ref("GalleryPage/Banner"));

    $scope.bannerUpload = function(){
        var tempImageName = "GalleryPageBanner";
        var storageRef = $firebaseStorage(firebase.storage().ref("photos/staticpages/" + tempImageName));
        var file = document.querySelector('input[type=file]#inp_bannerPhoto').files[0];
        var bannerRef = $firebaseObject(firebase.database().ref("GalleryPage/Banner"));

        if(file == null){
            alert("No Image Selected");
            return;
        }

        
        var uploadTask = storageRef.$put(file, {contentType: file.type});
        uploadTask.$complete(function(snapshot){
            bannerRef.$loaded().then(function(){
                bannerRef.Image = snapshot.downloadURL;
                bannerRef.$save().then(function(ref) {
                    // ref.key === AlbumInfo.$id; // true
                }, function(error) {
                console.log("Error:", error);
            })
            });
        });
        uploadTask.$error(function(error){
            alert("Failed To Update Banner");
        });
        uploadTask.$progress(function(snapshot) {
            var percentUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(percentUploaded);
        });
    }
});
