angular.module("nexcast.playerWrapper.layout.component", [])
    .directive("playerWrapperLayout", function tccPageContainer($rootScope, $timeout) {
    return {
        restrict: "EA",
        transclude: true,
        templateUrl: "js/components/playerWrapper.layout.html",
        scope: {
            title: "="
        },
        link: function (scope) {
            scope.alerts = [];

            $rootScope.$watch('myAccount', function (newData, oldData) {
            });
        }
    };
});

