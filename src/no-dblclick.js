var module = angular.module('noDblclick', ['ng']);

module
.directive('noDblclick', [ "$compile", "$timeout", function( $compile, $timeout ) {
	'use strict';

		// I augment the template element DOM structure before linking.
        function compile( tElement ) {

            var sublink,
            ngClick = tElement.attr("ng-click");
            tElement.attr( "ng-disabled", "is_disabled" );
            tElement.attr( "ng-click", (ngClick || '')+";disableNoDbClickBtn()" );

            sublink = $compile( tElement, null, 1500 );

            /*jslint unparam:true */
            function link( $scope, element, attributes, modelCtrl, transclude ) {

                $scope.is_disabled = false;
                var dbClickEvent = $scope.$on('noDbClick.unlock', function(event, id) {
                    if(!id || element.attr('id')===id){
                        $timeout(function () {
                            $scope.is_disabled = false;
                        });
                    }
                });

                $scope.disableNoDbClickBtn = function () {
                    $timeout(function () {
                        $scope.is_disabled = true;
                    });
                };

                $scope.$on('$destroy', function() {
                    if(dbClickEvent) {
                        dbClickEvent();
                    }
                });

                // Because we are using the ISOLATE scope, in this case, we have
                // to transclude the content. If we don't do this, then the call
                // to $compile() above and sublink() below will end up linking
                // the element CONTENT to the ISOLATE scope, which will break
                // our references. So, instead, what we have to do is allow the
                // content to be transcluded and linked to the outer scope
                // (outside of our directive).
                transclude(
                    function( content ) {

                        element.append( content );

                    }
                );

                // Link the compiled directives that we dynamically added to the
                // current element. This will also link any directives that were
                // already on the element, but were at a lower priority.
                // --
                // NOTE: We probably we want to do this after the transclude()
                // since a directive is supposed to be able to rely on the DOM
                // of its child content.
                sublink( $scope );

            }

            return link;

        }
        /*jslint unparam:false */

	return {
        compile: compile,
        priority: 1500,
        restrict: "A",
        // scope: {
        //     isolateFriend: "=bnFriend"
        // },
        terminal: true,
        transclude: true
	};

}]);

