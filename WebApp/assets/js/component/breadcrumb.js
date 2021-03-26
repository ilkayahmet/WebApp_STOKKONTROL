app.angular.component('breadcrumb', {
    templateUrl:'assets/template/breadcrumbs.html',
    controller: ['$scope', function ($scope) {
        this.breadcrumbs = page.data.breadcrumbs;
    }]
});