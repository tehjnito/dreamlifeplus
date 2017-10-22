var appAdmin = angular.module('appAdmin',['firebase','ngFileUpload']);

appAdmin.controller('ctrl_admin_albums', function($scope, $firebaseObject, $firebaseArray){
    $scope.Albums = [];
    $scope.AlbumImages = [];
    $scope.aEdit = {
        Name: "",
    };
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
                    ref.key === AlbumInfo.$id; // true
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
                var listRef = $firebaseArray(firebase.database().ref("Photos"));
                for(var i = 0; i < files.length;i++){
                    listRef.$add({AlbumID: $scope.CurrentEditAlbum.$id, Image: fileStrings[i]}).then(function(ref){});
                }
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
            $scope.AlbumImages.$remove(_val).then(function(ref){
                if(ref.key == _val.$id){
                    alert("Removed Successfully");
                }else{
                    alert("Failed to Remove the Record");
                }
            });
        }
    };
    
});
