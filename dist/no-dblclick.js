var module = angular.module('noDblclick', ['ng']);

module
.factory('noDblclickService', [ '$compile', function( $compile ) {
    'use strict';

    var service = function (tElement) {
        var me = this,
        ngClick = (tElement.attr('ng-click') || '').replace(/\s/g, ''),
        ngDblclick = (tElement.attr('ng-dblclick') || '').replace(/\s/g, ''),
        ngDisabled = (tElement.attr('ng-disabled') || '').replace(/\s/g, '');
      
      
        // Add lock function to ng-click
        if(ngClick!==''){
            if(ngClick.slice(-1)===';'){
                ngClick = ngClick.slice(0, -1);
            }
            ngClick = '(noDblclickService.is_disabled || ('+ngClick+'));';
        }
        ngClick += 'noDblclickService.lock();';


        // prevent double click
        if(ngDblclick!=='' && ngDblclick.indexOf(';', ngDblclick.length - 1) < 0){
            ngDblclick += ';';
        }
        ngDblclick = 'return -1;';


        // Add isDisabled expression to ng-disabled
        if(ngDisabled!==''){
            ngDisabled = '('+ngDisabled+') || ';
        }
        ngDisabled += 'noDblclickService.isDisabled();';

        // Set new attributes
        tElement.attr( 'ng-click', ngClick);
        tElement.attr( 'ng-dblclick', ngDblclick);
        tElement.attr( 'ng-disabled', ngDisabled);


        this.is_disabled = false;
        this.sublink = $compile( tElement, null, 1500 );
        this.key = tElement.attr('no-dblclick');

        this.lock = function () {
            me.is_disabled = true;
        };

        this.unlock = function () {
            me.is_disabled = false;
        };

        this.isDisabled = function () {
            return me.is_disabled;
        };

        /*jslint unparam:true */
        this.getLink = function ( $scope, element, attributes, modelCtrl, transclude ) {

            $scope = $scope.$parent.$new();
            $scope.noDblclickService = me;

            var garbage = []; 

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
            });


            transclude(
                function( content ) {
                    element.append( content );
                }
            );

            $scope.noDblclickService.sublink( $scope );

        };
        /*jslint unparam:false */

    };

    return {
        getService: function (tElement) {
            return new service(tElement);
        }
    };
}])
.directive('noDblclick', [ 'noDblclickService', function( noDblclickService ) {
    'use strict';

    // I augment the template element DOM structure before linking.
    function compile( tElement ) {
        return noDblclickService.getService(tElement).getLink;
    }

    return {
        compile: compile,
        priority: 1500,
        restrict: 'A',
        terminal: true,
        transclude: true,
        scope:{}
    };

}]);
