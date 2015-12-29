var module = angular.module('noDblclick', ['ng']);

module
.factory('noDblclickService', [ '$timeout', function( $timeout ) {
    'use strict';

    var service = function ($scope, element) {
        var me = this;

        this.is_disabled = false;
        this.key = element.attr('no-dblclick');

        this.lock = function () {
            $timeout(function () {
                me.is_disabled = true;
                element.attr('disabled', 'disabled');
            });
        };

        this.unlock = function () {
            me.is_disabled = false;
            element.removeAttr('disabled');
        };

        this.isDisabled = function () {
            return me.is_disabled;
        };

        /*jslint unparam:true */
        this.getLink = function () {

            $scope = $scope.$parent.$new();
            $scope.noDblclickService = me;

            var garbage = []; 

            element.bind('click', function(e) {

                // Kill ng-click if disabeld
                if(me.is_disabled){
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return false;
                }

                // Lock element
                me.lock();
            });

            // Add listeners to scope
            garbage.push($scope.$on('noDblclick.unlock', function(event, id) {
                if(id===undefined || id===$scope.noDblclickService.key){
                    $scope.noDblclickService.unlock();
                }
            }));
            garbage.push($scope.$on('noDblclick.lock', function(event, id) {
                if(id===undefined || id===$scope.noDblclickService.key){
                    $scope.noDblclickService.lock();
                }
            }));

            // Destroy listeners
            $scope.$on('$destroy', function() {
                angular.forEach(garbage, function (listener) {
                    listener();
                });
                element.unbind('click');
            });

        };
        /*jslint unparam:false */

    };

    return service;
}])
.directive('noDblclick', [ 'noDblclickService', function( noDblclickService ) {
    'use strict';

    return {
        priority: -1500,
        restrict: 'A',
        link: function ($scope, element) {
            return new noDblclickService($scope, element).getLink();
        },
        scope:{}
    };

}]);
