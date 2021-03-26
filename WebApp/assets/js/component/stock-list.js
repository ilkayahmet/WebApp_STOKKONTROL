app.angular
.component('stockList', {
    templateUrl: 'assets/template/stock-list.html',
    controller: ['$scope', '$http', '$timeout', '$rootScope', function ($scope, $http, $timeout, $rootScope) {
        $rootScope.loadList = function () {
            $scope.stock.filter.init();
            $scope.stock.page.index = 1;
            $scope.stock.load();
        };
        $scope.stock = {
            page: {
                index: 1
            },
            filter: {
                type: 1, //this filter type is for page selecting
                value: '',
                init: function () {
                    $scope.stock.filter.value = '';
                },
                change: function () {
                    $scope.stock.filter.timer.set();
                },
                timer: {
                    value: null,
                    interval: 500,
                    set: function () {
                        if ($scope.stock.filter.timer.value) {
                            $timeout.cancel($scope.stock.filter.timer.value);
                            $scope.stock.filter.timer.value = null;
                        }
                        $scope.stock.filter.timer.value = $timeout(function () {
                            if ($scope.stock.isLoading) {
                                return;
                            }
                            $scope.stock.page.index = 1;
                            $scope.stock.load();
                        }, $scope.stock.filter.timer.interval);
                    }
                }
            },
            totalRow: {
                value: 0,
                set: function (value) {
                    var paginate = $scope.stock.totalRow.value !== value;
                    $scope.stock.totalRow.value = value;
                    if (paginate) {
                        $scope.stock.paginate();
                    }
                }
            },
            maxVisibleRow: {
                value: app.pagination.maxVisible.row,
                set: function (value) {
                    var paginate = $scope.stock.maxVisibleRow.value !== value;
                    $scope.stock.maxVisibleRow.value = value;
                    if (paginate) {
                        $scope.stock.paginate();
                    }
                }
            },
            list: [],
            isExist: false,
            isLoading: false,
            load: function () {
                $scope.stock.isLoading = true;
                app.show.spinner($('stock-list > div:first'));
                $http({
                    method: 'POST',
                    url: 'services/stock.ashx?&t=2&d=' + new Date(),
                    data: {
                        pageIndex: $scope.stock.page.index,
                        filter: $scope.stock.filter.value,
                        pageRowCount: $scope.stock.maxVisibleRow.value
                    }
                }).then(function (response) {
                    $scope.stock.isLoading = false;
                    app.hide.spinner($('stock-list > div:first'));
                    if (!response.data.hasOwnProperty('RESULT')) {
                        app.show.error('Bir şeyler ters gitti...');
                        return;
                    }
                    $scope.stock.list = response.data.LIST;
                    $scope.stock.isExist = $scope.stock.list.length > 0;
                    $scope.stock.totalRow.set(response.data.TOTALROW);
                }, function (response) {
                    $scope.stock.isLoading = false;
                    console.log(response);
                    app.show.error('Bir şeyler ters gitti...');
                    app.hide.spinner($('stock-list > div:first'));
                });
            },
            show: {
                update: function (stock) {
                    $rootScope.showModifyModal(stock);
                },
                delete: function (stock) {
                    $rootScope.showDeleteModal(stock);
                }
            },
            paginate: function () {
                var pageCount = $scope.stock.totalRow.value !== 0 ? Math.ceil($scope.stock.totalRow.value / $scope.stock.maxVisibleRow.value) : 1;
                $('.bootpag-flat').bootpag({
                    total: pageCount,
                    maxVisible: app.pagination.maxVisible.pageIndex,
                    page: $scope.stock.page.index,
                    leaps: false
                }).on("page", function (event, num) {
                    $scope.stock.page.index = num;
                    $scope.stock.load();
                }).children('.pagination').addClass('pagination-flat pagination-sm');
            }
        };
        $scope.stock.load();
    }]
});