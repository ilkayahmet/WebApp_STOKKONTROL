app.angular
.controller('productCreateBtnCtrl', ['$scope', function ($scope) {
    $scope.cls = document.documentElement.lang === 'ar' ? 'fab-menu-bottom-left' : 'fab-menu-bottom-right';
    $scope.show = {
        modal: function () {
            $('.product-create-modal:first').modal({
                backdrop: 'static'
            });
        }
    };
}])
.directive('productCreateBtn', function () {
    return {
        restrict: 'E',
        templateUrl: 'assets/template/product-create-btn.html'
    };
});