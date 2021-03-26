app.angular
.controller('productListCtrl', ['$scope', '$http', '$timeout', '$rootScope', function ($scope, $http, $timeout, $rootScope) {
    $rootScope.loadList = function () {
        $scope.product.filter.init();
        $scope.product.page.index = 1;
        $scope.product.load();
    };
    $scope.product = {
        page: {
            index: 1
        },
        filter: {
            type: 1, //this filter type is for page selecting
            value: '',
            init: function () {
                $scope.product.filter.value = '';
            },
            change: function () {
                $scope.product.filter.timer.set();
            },
            timer: {
                value: null,
                interval: 500,
                set: function () {
                    if ($scope.product.filter.timer.value) {
                        $timeout.cancel($scope.product.filter.timer.value);
                        $scope.product.filter.timer.value = null;
                    }
                    $scope.product.filter.timer.value = $timeout(function () {
                        if ($scope.product.isLoading) {
                            return;
                        }
                        $scope.product.page.index = 1;
                        $scope.product.load();
                    }, $scope.product.filter.timer.interval);
                }
            }
        },
        totalRow: {
            value: 0,
            set: function (value) {
                var paginate = $scope.product.totalRow.value !== value;
                $scope.product.totalRow.value = value;
                if (paginate) {
                    $scope.product.paginate();
                }
            }
        },
        maxVisibleRow: {
            value: app.pagination.maxVisible.row,
            set: function (value) {
                var paginate = $scope.product.maxVisibleRow.value !== value;
                $scope.product.maxVisibleRow.value = value;
                if (paginate) {
                    $scope.product.paginate();
                }
            }
        },
       
        list: [],
        isExist: false,
        load: function () {
            $scope.product.isLoading = true;
            app.show.spinner($('product-list > div:first'));
            $http({
                method: 'POST',
                url: 'services/product.ashx?&t=2&d=' + new Date(),
                data: {
                    pageIndex: $scope.product.page.index,
                    filterType: $scope.product.filter.type,
                    filter: $scope.product.filter.value,
                    pageRowCount: $scope.product.maxVisibleRow.value
                 
                }
            }).then(function (response) {
                $scope.product.isLoading = false;
                app.hide.spinner($('product-list > div:first'));
                if (!response.data.hasOwnProperty('RESULT')) {
                    app.show.error('Bir şeyler ters gitti...');
                    return;
                }
                $scope.product.list = response.data.LIST;
                $scope.product.isExist = $scope.product.list.length > 0;
                $scope.product.totalRow.set(response.data.TOTALROW);
            }, function (response) {
                $scope.product.isLoading = false;
                console.log(response);
                    app.show.error('Bir şeyler ters gitti...');
                app.hide.spinner($('product-list > div:first'));
            });
        },
        show: {
            update: function (product) {
                $rootScope.showModifyModal(product);
            },
            delete: function (product) {
                $rootScope.showDeleteModal(product);
            }
        },
        paginate: function () {
            var pageCount = $scope.product.totalRow.value !== 0 ? Math.ceil($scope.product.totalRow.value / $scope.product.maxVisibleRow.value) : 1;
            $('.bootpag-flat').bootpag({
                total: pageCount,
                maxVisible: app.pagination.maxVisible.pageIndex,
                page: $scope.product.page.index,
                leaps: false
            }).on("page", function (event, num) {
                $scope.product.page.index = num;
                $scope.product.load();
            }).children('.pagination').addClass('pagination-flat pagination-sm');
        }
    };
    $scope.product.load();
}])
.directive('productList', function () {
    return {
        restrict: 'E',
        templateUrl: 'assets/template/product-list.html'
    };
});