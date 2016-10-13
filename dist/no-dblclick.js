angular.module('noDblclick', ['ng'])

.factory('noDblclickService', [ '$rootScope', function( $rootScope ) {
    'use strict';

    var service = function ($scope, element) {
        var me = this;

        this.is_disabled = false;
        this.key = element.attr('no-dblclick');

        this.lock = function () {
            me.is_disabled = true;
            element.addClass('disabled');
        };

        this.unlock = function () {
            me.is_disabled = false;
            element.removeClass('disabled');
        };

        /*jslint unparam:true */
        this.link = function () {
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
                if(me.key){
                    $rootScope.$broadcast('noDblclick.lock', me.key);
                }
            });

            // Add listeners to scope
            garbage.push($scope.$on('noDblclick.unlock', function(event, id) {
                if(id===undefined || id===me.key){
                    me.unlock();
                }
            }));
            garbage.push($scope.$on('noDblclick.lock', function(event, id) {
                if(id===undefined || id===me.key){
                    me.lock();
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
            return new noDblclickService($scope, element).link();
        }
    };

}]);
