app.angular
    .controller('stockReportBtnCtrl', ['$scope', function ($scope) {
        $scope.cls = 'fab-menu-top-right';
        $scope.report = {
            modal: function () {
                $('.stock-report-modal:first').modal({
                    backdrop: 'static'
                });
            }
        };
    }])
    .directive('stockReportBtn', function () {
        return {
            restrict: 'E',
            templateUrl: 'assets/template/stock-report-btn.html'
        };
    });