'use strict';

/**
 * @ngdoc function
 * @name GameSwap.controller:LoginController
 * @description
 * # HomeController
 */
angular.module('GameSwap')
    .controller('LoginController', function($cordovaOauth, $window, $http, ServerService, $location, $state, $q) {
        if (ServerService.isLogged()) {
            $state.go('app.home');
        }

        this.newUser = {};
        var self = this;

        this.loginFacebook = function() {
            $cordovaOauth.facebook("392617384261537", ["email", "public_profile"]).then(function(result) {
                $window.localStorage.accessToken = result.access_token;

                self.getFacebookUserInfos().then(function(user) {
                    ServerService.logUser(user.email).then(function() {
                        $state.go('app.home');
                    }, function(error){
                        // User not yet created, registering
                        var newUser = {
                            name: {
                                first: user.first_name,
                                last: user.last_name
                            },
                            email: user.email
                        };
                        console.log(newUser);
                        ServerService.registerUser(newUser).then(function() {
                            $state.go('app.home');
                        }).catch(function(error) {
                            console.error('oops', error);
                        });
                    });

                });
            }, function(error) {
                alert('Cannot authenticate in web browser! Faking login');
                ServerService
                    .logUser("clementpeyrabere@gmail.com")
                    .then(function() {
                        $state.go('app.home');
                    }).catch(function(error) {
                        console.error('oops', error);
                    });

            });
        };

        self.getFacebookUserInfos = function() {
            var deferred = $q.defer();
            $http.get("https://graph.facebook.com/v2.2/me", {
                params: {
                    access_token: $window.localStorage.accessToken,
                    fields: "first_name,last_name,email",
                    format: "json"
                }
            }).then(function(result) {
                console.log(result);
                deferred.resolve(result.data);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.register = function() {
            if (this.user.name.first && this.user.name.last && this.user.email) {
                ServerService
                    .registerUser(this.user)
                    .then(function() {
                        $state.go('app.home');
                    }).catch(function(error) {
                        console.error('oops', error);
                    })
            }
        }
    });