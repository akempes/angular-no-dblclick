/*global alert, confirm*/

var myApp = angular.module('exampleApp',['noDblclick']);

myApp
.controller('ExampleBaseController', ['$scope', function( $scope ){
    'use strict';

        $scope.test = function () {
            console.log('test');
        }

    }
])
.controller('ExampleChildController', ['$scope', '$rootScope', function( $scope, $rootScope ){
    'use strict';

        $scope.lockRootAll = function () {
            $rootScope.$broadcast('noDblclick.lock');
        };

        $scope.unlockRootAll = function () {
            $rootScope.$broadcast('noDblclick.unlock');
        };
    }
]);


