"use strict";
app.controller('office.common.imgsCtrl', function($scope){
    $scope.q = [1,2,3,4,5];
    var count = 0;

    this.addImg = function(){
        count++;
        if(count < 5)
           $scope.q.splice(0,1);

    };

    this.removeImg = function(j){
        $scope.profile.images.splice(j, 1);
        if(count < 5)
            $scope.q.push(1);
        count--;
    };
});
