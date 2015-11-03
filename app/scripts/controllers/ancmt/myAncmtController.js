'use strict';

/**
 * @ngdoc function
 * @name GameSwap.controller:myAncmtController
 * @description
 * # myAncmtController
 */
angular.module('GameSwap')
  .controller('MyAncmtController', function(ServerService, AncmtService, $q) {
    var self = this;
    self.myAncmts = [];

    if (ServerService.getFavorisAnnoncement()) {
        
      var tblFavoris = ServerService.getFavorisAnnoncement().split(',');
        
      for (var i = 0, l = tblFavoris.length; i < l; ++i) {
        AncmtService.get({'id': tblFavoris[i]}).$promise.then(function(data) {
          self.myAncmts.push(data);
        });
      }
    }

  });