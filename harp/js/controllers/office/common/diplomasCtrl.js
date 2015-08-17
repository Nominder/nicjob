"use strict";
app.controller('office.common.diplomasCtrl', function($scope){
    $scope.diplomasEmpty = [1,2,3,4];
    var count = 0;

    this.addImg = function(){
        count++;
        if(count < 4)
            $scope.diplomasEmpty.splice(0,1);

    };

    this.removeImg = function(j){
        $scope.profile.diplomas.splice(j, 1);
        if(count < 4)
            $scope.diplomasEmpty.push(1);
        count--;
    };
});

