app.angular.component('pageHeader', {
    templateUrl:'assets/template/page-header.html',
    controller: ['$scope', function ($scope) {
        this.pageHeader = page.data.header;
        $scope.iconCls =  'icon-arrow-left52';
    }]
});