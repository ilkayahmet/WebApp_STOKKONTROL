app.angular
.component('stockCreateBtn', {
    templateUrl: 'assets/template/stock-create-btn.html',
    controller: ['$scope', function ($scope) {
        $scope.cls = 'fab-menu-bottom-right';
        $scope.show = {
            modal: function () {
                $('.stock-create-modal:first').modal({
                    backdrop: 'static'
                });
            }
        };
    }]
});