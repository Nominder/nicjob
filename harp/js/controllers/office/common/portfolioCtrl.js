"use strict";
app.controller('office.common.portfolioCtrl', function($scope){
    $scope.portfolioEmpty = [1,2,3,4];
    var count = 0;

    this.addImg = function(){
        count++;
        if(count < 4)
            $scope.portfolioEmpty.splice(0,1);
    };

    this.removeImg = function(j){
        $scope.profile.portfolio.images.splice(j, 1);
        if(count < 4)
            $scope.portfolioEmpty.push(1);
        count--;
    };
});

