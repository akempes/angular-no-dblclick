var module = angular.module('noDblclick', ['ng']);

module
.service('noDblclickService', [function ( ) {
    'use strict';

    var elements = {},
    increment = 0,
    
    // Toggle is-disabled state
    setState = function (id, state) {
        if(elements[id].isDisabled!==state){
            elements[id].isDisabled = state;
        }
    };

    // Get element disabled state
    this.isDisabled = function (id) {
        return elements[id].isDisabled;
    };

    // Set disabled
    this.lock = function (id) {
        setState(id, true);
    };

    // Unset disabled
    this.unlock = function (id) {
        setState(id, false);
    };

    // Add element to service
    this.add = function (obj) {
        obj = angular.extend(obj || {}, {
            id        : increment++,
            isDisabled: false
        });
        elements[obj.id] = obj;

        return obj;
    };

    // Remove element from service
    this.remove = function (id) {
        delete elements[id];
    };


}])
.directive('noDblclick', [ 'noDblclickService', '$compile', function( noDblclickService, $compile ) {
	'use strict';

		// I augment the template element DOM structure before linking.
        function compile( tElement ) {

            var sublink, obj,
            ngClick = (tElement.attr('ng-click') || '').replace(/\s/g, ''),
            ngDblclick = (tElement.attr('ng-dblclick') || '').replace(/\s/g, ''),
            ngDisabled = (tElement.attr('ng-disabled') || '').replace(/\s/g, '');


            // Add object to service
            obj = noDblclickService.add();

          
            // Add disableMe function to ng-click
            if(ngClick!=='' && ngClick.indexOf(';', ngClick.length - 1) < 0){
                ngClick += ';';
            }
            ngClick += 'noDblclickService.lock('+obj.id+');';


            // prevent double click
            if(ngDblclick!=='' && ngDblclick.indexOf(';', ngDblclick.length - 1) < 0){
                ngDblclick += ';';
            }
            ngDblclick = 'return -1;';


            // Add isDisabled expression to ng-disabled
            if(ngDisabled!==''){
                ngDisabled = '('+ngDisabled+') || ';
            }
            ngDisabled += 'noDblclickService.isDisabled('+obj.id+');';


            // Set new attributes
            tElement.attr( 'ng-click', ngClick);
            tElement.attr( 'ng-dblclick', ngDblclick);
            tElement.attr( 'ng-disabled', ngDisabled);

            sublink = $compile( tElement, null, 1500 );

            /*jslint unparam:true */
            function link( $scope, element, attributes, modelCtrl, transclude ) {

                // Add service to scope
                if(!$scope.noDblclickService){
                    $scope.noDblclickService = noDblclickService;
                }             

                var garbage = []; 

                // Add listeners to scope
                garbage.push($scope.$on('noDblclick.unlock', function(event, id) {
                    noDblclickService.unlock( id===undefined ? obj.id : id );
                }));
                garbage.push($scope.$on('noDblclick.lock', function(event, id) {
                    noDblclickService.lock( id===undefined ? obj.id : id );
                }));


                // Destroy listeners
                $scope.$on('$destroy', function() {
                    angular.forEach(garbage, function (listener) {
                        listener();
                        noDblclickService.remove(obj.id);
                    });
                });


                transclude(
                    function( content ) {
                        element.append( content );
                    }
                );

                sublink( $scope );

            }
            /*jslint unparam:false */

            return link;

        }

	return {
        compile: compile,
        priority: 1500,
        restrict: 'A',
        terminal: true,
        transclude: true
	};

}]);

