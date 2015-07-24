var module = angular.module('noDblclick', ['ng']);

module
.service('noDblclickService', [ function ( ) {
    'use strict';

    var elements = {},
    lookUp = {},
    increment = 0,
    
    getId = function (id) {
        if(angular.isString(id) && lookUp[id]!==undefined){
            return lookUp[id];
        }
        return id;
    },
    getKey = function (id) {
        if(!angular.isString(id) && elements[id]!==undefined){
            return elements[id].key;
        }
        return id;
    },

    // Toggle is-disabled state
    setState = function (id, state) {

        id = getId(id);
        if(elements[id].isDisabled!==state){
            elements[id].isDisabled = state;
        }
    };

    // Get element disabled state
    this.isDisabled = function (id) {
        id = getId(id);
        return id!==undefined && elements[id] ? elements[id].isDisabled : false;
    };

    // Set disabled
    this.lock = function (id) {
        setState(id, true);
    };

    // Unset disabled
    this.unlock = function (id) {
        setState(id, false);
    };

    this.get = function (id){
        id = getId(id);
        return elements[id] || undefined;
    };

    // Add element to service
    this.add = function (key) {

        if(key && (!angular.isString(key) || (angular.isString(key) && lookUp[key]))){
            throw 'noDblclick :: Invalid key. Key must be a string and unique.';
        }

        var obj = {
            id        : angular.copy(increment),
            key       : key,
            isDisabled: false
        };
        increment += 1;
        elements[obj.id] = obj;
        lookUp[key] = obj.id;

        return obj;
    };

    // Remove element from service
    this.remove = function (id) {
        delete lookUp[getKey(id)];
        delete elements[getId(id)];
    };


}])
.directive('noDblclick', [ 'noDblclickService', '$compile', '$parse', function( noDblclickService, $compile, $parse ) {
    'use strict';

        // I augment the template element DOM structure before linking.
        function compile( tElement ) {

            var sublink, obj,
            ngClick = (tElement.attr('ng-click') || '').replace(/\s/g, ''),
            ngDblclick = (tElement.attr('ng-dblclick') || '').replace(/\s/g, ''),
            ngDisabled = (tElement.attr('ng-disabled') || '').replace(/\s/g, '');


            // Add object to service
            obj = noDblclickService.add(tElement.attr('no-dblclick'));

          
            // Add disableMe function to ng-click
            if(ngClick!=='' && ngClick.indexOf(';', ngClick.length - 1) < 0){
                ngClick += ';';
            }
            ngClick += 'noDblclickService.lock('+obj.id+');';
            obj.ngClick = ngClick;


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
            tElement.attr( 'ng-click', 'noDblclickServiceClick('+obj.id+')');
            tElement.attr( 'ng-dblclick', ngDblclick);
            tElement.attr( 'ng-disabled', ngDisabled);

            sublink = $compile( tElement, null, 1500 );

            /*jslint unparam:true */
            function link( $scope, element, attributes, modelCtrl, transclude ) {

                // Add service to scope
                if(!$scope.noDblclickService){
                    $scope.noDblclickService = noDblclickService;
                    $scope.noDblclickServiceClick = function (id) {
                        if(!noDblclickService.isDisabled(id)){
                            var expression = $parse(noDblclickService.get(id).ngClick);
                            expression($scope);
                        }
                    };
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
