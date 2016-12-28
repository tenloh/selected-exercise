app.controller('UploadCtrl', ['$scope', 'Upload', 'UploadFactory', function ($scope, Upload, UploadFactory) {

    $scope.tableToggle = false;
    $scope.teachers = [];
    /*
        Function purpose is to upload file when user selects a CSV file.

        TODO: Make sure that only CSV files are added

    */
    $scope.onFileSelect = function ($files) {

        //From ngFileUpload
        Upload.upload({
            url: 'http://localhost:3456/file',
            file: $files,
        }).progress(function (e) {
        }).then(function (data, status, headers, config) {
            // file is uploaded successfully
            console.log(data);
        });
    }

    $scope.toggle = function () {
        $scope.tableToggle = !$scope.tableToggle
        UploadFactory.getTeachers()
            .then(teachers => {
                $scope.teachers = teachers;
            })
            .catch(err => console.error(err))
    }

}]);