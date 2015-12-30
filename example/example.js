/*global alert, confirm*/

var myApp = angular.module('exampleApp',['noDblclick']);

myApp
.controller('ExampleBaseController', ['$scope', function( $scope ){
    'use strict';

        $scope.logging = [];

        $scope.test = function (who) {
            var now = new Date;
            $scope.logging.push({msg:who, when:now});
        };

    }
])
.controller('ExampleChildController', ['$scope', '$rootScope', function( $scope, $rootScope ){
    'use strict';

        $scope.lockViaRootScope = function (key) {
            $rootScope.$broadcast('noDblclick.lock', key);
        };

        $scope.unlockViaRootScope = function (key) {
            $rootScope.$broadcast('noDblclick.unlock', key);
        };

        $scope.lockRootAll = function () {
            $rootScope.$broadcast('noDblclick.lock');
        };

        $scope.unlockRootAll = function () {
            $rootScope.$broadcast('noDblclick.unlock');
        };

    }
]);


