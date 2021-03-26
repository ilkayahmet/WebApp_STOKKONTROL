app.angular
.component('productDropdown', {
    templateUrl: 'assets/template/product-dropdown.html',
    controller: ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
        var ctrl = this;
        $scope.product = {
            shouldInitOnInputChange: false,
            onfocus: false,
            focus: function ($event) {
                $scope.product.onfocus = true;
                var length = typeof ctrl.inputValue === 'string' ? ctrl.inputValue.length : 0;
                $event.target.setSelectionRange(0, length);
                var width = angular.element($event.target).prop('offsetWidth');
                $scope.product.options.container.style.width = width + 'px';
                $scope.product.options.show();
                if (ctrl.shouldLoadOptionsOnInputFocus) {
                    $scope.product.options.load();
                }
            },
            blur: function () {
                $scope.product.onfocus = false;
                $scope.product.options.hide();
            },
            filter: {
                type: 0, 
                init: function () {
                    ctrl.inputValue = '';
                },
                change: function () {
                    $scope.product.filter.timer.set();
                    if ($scope.product.shouldInitOnInputChange && typeof ctrl.init === 'function') {
                        $scope.product.shouldInitOnInputChange = false;
                        ctrl.init();
                    }
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
                            if ($scope.product.options.isLoading) {
                                return;
                            }
                            $scope.product.options.page.index = 1;
                            $scope.product.options.load();
                        }, $scope.product.filter.timer.interval);
                    }
                }
            },
            options: {
                page: {
                    index: 1,
                    count: 1,
                    isLastPage: true
                },
                totalRow: {
                    value: 0,
                    set: function (value) {
                        $scope.product.options.totalRow.value = value;
                    }
                },
                maxVisibleRow: {
                    value: app.pagination.maxVisible.row,
                    set: function (value) {
                        $scope.product.options.maxVisibleRow.value = value;
                    }
                },
                isExist: false,
                isLoading: false,
                list: [],
                container: {
                    style: {
                        width: '0px'
                    },
                    cls: ''
                },
                show: function () {
                    $scope.product.options.container.cls = 'open';
                },
                hide: function () {
                    $timeout(function () {
                        if ($scope.product.onfocus || $scope.product.options.more.onfocus) {
                            return;
                        }
                        $scope.product.options.container.cls = '';
                    }, 250);
                },
                load: function (extendList) {
                    $scope.product.options.isLoading = true;
                    app.show.spinner($('product-dropdown > .option-container'));
                    $http({
                        method: 'POST',
                        url: 'services/product.ashx?&t=2&d=' + new Date(),
                        data: {
                            pageIndex: $scope.product.options.page.index,
                            filterType: $scope.product.filter.type,
                            filter: ctrl.inputValue,
                            pageRowCount: $scope.product.options.maxVisibleRow.value
                        }
                    }).then(function (response) {
                        $scope.product.options.isLoading = false;
                        app.hide.spinner($('product-dropdown > .option-container'));
                        if (!response.data.hasOwnProperty('RESULT')) {
                            app.show.error('Bir şeyler ters gitti...');
                            return;
                        }
                        if (!extendList) {
                            $scope.product.options.list = response.data.LIST;
                        } else {
                            $scope.product.options.list.push.apply($scope.product.options.list, response.data.LIST);
                        }
                        $scope.product.options.isExist = $scope.product.options.list.length > 0;
                        ctrl.shouldLoadOptionsOnInputFocus = !$scope.product.options.isExist;
                        $scope.product.options.totalRow.set(response.data.TOTALROW);
                        $scope.product.options.paginate();
                    }, function (response) {
                        $scope.product.options.isLoading = false;
                        console.log(response);
                        app.show.error('Bir şeyler ters gitti...');
                        app.hide.spinner($('product-dropdown > .option-container'));
                    });
                },
                paginate: function () {
                    $scope.product.options.page.count = $scope.product.options.totalRow.value !== 0 ? Math.ceil($scope.product.options.totalRow.value / $scope.product.options.maxVisibleRow.value) : 1;
                    $scope.product.options.page.isLastPage = $scope.product.options.page.count <= $scope.product.options.page.index;
                },
                click: function (product) {
                    $scope.product.shouldInitOnInputChange = true;
                    ctrl.shouldLoadOptionsOnInputFocus = true;
                    ctrl.inputValue = product.NAME;
                    if (typeof ctrl.onSelect === 'function') {
                        ctrl.onSelect({ product: product });
                    }
                },
                more: {
                    load: function () {
                        if ($scope.product.options.page.isLastPage) {
                            return;
                        }
                        $scope.product.options.page.index++;
                        var extendList = true;
                        $scope.product.options.load(extendList);
                    },
                    onfocus: false,
                    focus: function () {
                        $scope.product.options.more.onfocus = true;
                    },
                    blur: function () {
                        $scope.product.options.more.onfocus = false;
                        $scope.product.options.hide();
                    }
                }
            }
        };
    }],
    bindings: {
        type: '@',
        inputLabel: '@',
        inputPlaceholder: '@',
        inputMessage: '@',
        componentClass: '@',
        onSelect: '&',
        init: '&',
        inputValue: '=',
        shouldLoadOptionsOnInputFocus: '=',
    }
});