app.factory('UploadFactory', function($http){

    return {
        getTeachers: function(){
            return $http.get('/teachers')
            .then(teachers => {
                console.log('teachers', teachers);
                return teachers.data
            })
        }
    }
})