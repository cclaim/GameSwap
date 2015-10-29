'use strict';

/**
 * @ngdoc function
 * @name GameSwap.serive:LoginService
 * @description
 * # ExampleService
 */
angular.module('GameSwap')
  // use factory for services
  .factory('ServerService', function($resource, ApiService, $http, $window, $q) {
    var _initialized = false;
    var loginEndPoint = ApiService.getLoginEndPoint();
    var tokenCheckEndPoint = ApiService.getTokenCheckEndPoint();
    var isLogged = false; 

    this.initialize = function() {
        var deferred = $q.defer();

        if(isLogged) {
            deferred.resolve();
        }
        if($window.localStorage.server_token) {
            this.checkTokenValidity().then(function(){
                isLogged = true;
                deferred.resolve();
            }, function() {
                deferred.reject();
            });   
        } else {
            deferred.reject();
        }
        return deferred.promise;
    };

    this.checkTokenValidity = function() {
        var deferred = $q.defer();
        var token = $window.localStorage.server_token || null;
        if(token) {
            var config =  {
                headers: {
                    'x-access-token': token
                }
            };

            $http.post(tokenCheckEndPoint, config).success(function(response) {
                console.log('token ok');
                deferred.resolve();
            }).error(function(error) {
                console.error('Token is no longer valid');
                deferred.reject();
            });
        } else {
            deferred.reject();
        }
        return deferred.promise;
    };

    this.logUser = function(email) {
    	if(!email) {
    		throw 'No email specified';
    		return;
    	}
        var deferred = $q.defer();

    	var data = JSON.stringify({
    		firstName : email 
    	});

    	$http.post(loginEndPoint, data).success(function(response) {
            $window.localStorage.server_token = response.token;
            $window.localStorage.logged_user = JSON.stringify(response.user);
            isLogged = true; 
            deferred.resolve();
    	}).error(function(error) {
    		console.error('failed to log user : ', error);
            deferred.reject();
    	});

        return deferred.promise;

    };

    this.isLogged = function() {
        return isLogged;
    };

    this.getLoggedUser = function() {
        return JSON.parse($window.localStorage.logger_user);
    };

    return this;
  });
