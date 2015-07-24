/*global alert, confirm*/

var myApp = angular.module('exampleApp',['noDblclick']);

myApp.controller('ExampleController', ['$scope', function( $scope ){
    'use strict';

    	$scope.test1 = function () {
    		console.log('test1');
    	};

    	$scope.test2 = function () {
    		console.log('test2');
    	};

    	$scope.unlock = function  () {
    		$scope.$broadcast('noDblclick.unlock', 1);
    	}
    	
    	$scope.unlockall = function  () {
    		$scope.$broadcast('noDblclick.unlock');
    	}

    }
]);


