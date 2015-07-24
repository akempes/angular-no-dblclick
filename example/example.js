/*global alert, confirm*/

var myApp = angular.module('exampleApp',['noDblclick']);

myApp
.controller('ExampleBaseController', ['$scope', function( $scope ){
    'use strict';

        $scope.unlock = function () {
            $scope.$broadcast('noDblclick.unlock', 0);
        };

        $scope.unlockAll = function () {
            $scope.$broadcast('noDblclick.unlock');
        };

    }
])
.controller('ExampleChildController', ['$scope', '$rootScope', function( $scope, $rootScope ){
    'use strict';

        
        $scope.unlockInScope = function () {
            $scope.$broadcast('noDblclick.unlock', 2);
        };

        $scope.unlockAllInScope = function () {
            $scope.$broadcast('noDblclick.unlock');
        };
        

        $scope.unlockRoot = function () {
            $rootScope.$broadcast('noDblclick.unlock', 0);
        };

        $scope.unlockRootAll = function () {
            $rootScope.$broadcast('noDblclick.unlock');
        };
    }
]);


