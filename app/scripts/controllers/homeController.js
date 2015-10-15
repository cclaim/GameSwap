'use strict';

/**
 * @ngdoc function
 * @name GameSwap.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('GameSwap')
  .controller('HomeController', function($scope, ExampleService, UserService, $cordovaOauth) {
    this.users = [];


    $cordovaOauth.facebook("392617384261537", ["email"]).then(function(result) {
    	console.log("Result => "+result);
    }, function(error) {	
        console.error('EPIC FAIL : ', error);
    });


    this.getAllUsers = function() {
      UserService.query().$promise.then(function(data) {
        console.log(data);
      });
    }

    this.getAllUsers();
  });
