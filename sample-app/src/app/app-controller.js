var app = angular.module("app", ["ngRoute"]);

// app.config(function($routeProvider){
//     $routeProvider
//         .when("/first", { templateUrl: "first.component.html" });
// });

app.controller("AppController", function($scope, $location){

    // $scope.init = function(){
    //     $scope.addProduct = false;
    //     $scope.editProduct = false;
    // }

    // $scope.productOperation = function(operationType, productId){
    //     $scope.addProduct = false;
    //     $scope.editProduct = false;

    //     if(operationType === "add"){
    //         $scope.addProduct = true;
    //         console.log("Add productOperation requested...");
    //     }else if(operationType === "edit"){
    //         $scope.editProduct = true;
    //         console.log("Edit productOperation requested : " + productId);
    //     }

    //     $location.path("TestingPage");
    // };

});