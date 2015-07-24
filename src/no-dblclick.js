var module = angular.module('noDblclick', ['ng']);

module
.service('noDblclickService', ['$rootScope', function ( $rootScope ) {

    var setState = (function (id, state) {
        if(this.elements[id].isDisabled!==state){
            this.elements[id].isDisabled = state;
        }
    }).bind(this);

    this.elements = {};

    this.lock = function (id) {
        if( id === undefined ){
            Object.keys(this.elements).map((function (key) {
                setState(this.elements[key].id, true);
            }).bind(this));
        }else{
            setState(id, true);
        }
    };

    this.unlock = function (id) {
        if( id === undefined ){
            Object.keys(this.elements).map((function (key) {
                setState(this.elements[key].id, false);
            }).bind(this));
        }else{
            setState(id, false);
        }
    };

    $rootScope.$on('noDblclick.unlock', function(event, id) {
        this.unlock(id);
    });
    $rootScope.$on('noDblclick.lock', function(event, id) {
        this.lock(id);
    });

    $rootScope.noDblclickService = this;

}])
.directive('noDblclick', [ 'noDblclickService', '$compile', function( noDblclickService, $compile ) {
	'use strict';

		// I augment the template element DOM structure before linking.
        function compile( tElement ) {

            var 
            sublink,
            obj = {
                id: Object.keys(noDblclickService.elements).length,
                domId: tElement.attr('id') || '',
                el: tElement,
                isDisabled: false
            },
            ngClick = (tElement.attr('ng-click') || '').replace(/\s/g, ''),
            ngDblclick = (tElement.attr('ng-dblclick') || '').replace(/\s/g, ''),
            ngDisabled = (tElement.attr('ng-disabled') || '').replace(/\s/g, '');


            // Add object to service
            noDblclickService.elements[obj.id] = obj;
          

            // Add disableMe function to ng-click
            if(ngClick!=='' && ngClick.indexOf(';', ngClick.length - 1) < 0){
                ngClick += ';';
            }
            ngClick += 'noDblclickService.lock('+obj.id+')';


            // prevent double click
            if(ngDblclick!=='' && ngDblclick.indexOf(';', ngDblclick.length - 1) < 0){
                ngDblclick += ';';
            }
            ngDblclick = 'return -1';


            // Add isDisabled expression to ng-disabled
            if(ngDisabled!==''){
                ngDisabled = '('+ngDisabled+') || ';
            }
            ngDisabled += 'noDblclickService.elements['+obj.id+'].isDisabled';


            // Set new attributes
            tElement.attr( 'ng-click', ngClick);
            tElement.attr( 'ng-dblclick', ngDblclick);
            tElement.attr( "ng-disabled", ngDisabled);

            sublink = $compile( tElement, null, 1500 );

            /*jslint unparam:true */
            function link( $scope, element, attributes, modelCtrl, transclude ) {

                console.log($scope);

                var garbase = []; 

                // Add listeners to current scope
                garbase.push($scope.$on('noDblclick.unlock', function(event, id) {
                    noDblclickService.unlock(id);
                }));
                garbase.push($scope.$on('noDblclick.lock', function(event, id) {
                    noDblclickService.lock(id);
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

                sublink( $scope );

            }
            /*jslint unparam:false */

            return link;

        }

	return {
        compile: compile,
        priority: 1500,
        restrict: "A",
        terminal: true,
        transclude: true
	};

}]);

