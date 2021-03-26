app.angular
.component('stockDeleteModal', {
    templateUrl: 'assets/template/stock-delete-modal.html',
    controller: ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
        $rootScope.showDeleteModal = function (stockData) {
            $scope.stock.set(stockData);
            $('.stock-delete-modal:first').modal({
                backdrop: 'static'
            });
        };
        $scope.stock = {
            rawdata: null,
            id: {
                value: 0,
                init: function () {
                    $scope.stock.id.set(0);
                },
                set: function (value) {
                    $scope.stock.id.value = value;
                }
            },
            product: {
                value: '',
                init: function () {
                    $scope.stock.product.set('');
                },
                set: function (value) {
                    $scope.stock.product.value = value;
                }
            },
            quantity: {
                text: '',
                value: 0,
                init: function () {
                    $scope.stock.quantity.text = '';
                    $scope.stock.quantity.value = 0;
                },
                set: function (quantity) {
                    $scope.stock.quantity.value = quantity.value;
                    $scope.stock.quantity.text = quantity.text;
                }
            },
            utype: {
                value: '',
                init: function () {
                    $scope.stock.utype.set('');
                },
                set: function (value) {
                    $scope.stock.utype.value = value;
                }
            },
            comment: {
                value: '',
                init: function () {
                    $scope.stock.comment.value = '';
                },
                set: function (value) {
                    $scope.stock.comment.value = value;
                },
            },
            set: function (stockData) {
                $scope.stock.rawdata = stockData;
                $scope.stock.id.set(stockData.ID);
                $scope.stock.quantity.set({ value: stockData.QUANTITYVAL, text: stockData.QUANTITYTXT});
                $scope.stock.utype.set(stockData.UNITTXT);
                $scope.stock.comment.set(stockData.COMMENT);
                $scope.stock.product.set(stockData.P_NAME);
            },
            init: function () {
                $scope.stock.id.init();
                $scope.stock.product.init();
                $scope.stock.quantity.init();
                $scope.stock.utype.init();
                $scope.stock.comment.init();
            },
            delete: function () {
                app.show.spinner($('stock-delete-modal > div:first > div:first'));
                $http({
                    method: 'POST',
                    url: 'services/stock.ashx?&t=5&d=' + new Date(),
                    data: {
                        stockid: $scope.stock.id.value
                    }
                }).then(function (response) {
                    app.hide.spinner($('stock-delete-modal > div:first > div:first'));
                    if (!response.data.hasOwnProperty('RESULT')) {
                        app.show.error('Bir şeyler ters gitti...');
                        return;
                    }

                    if (response.data['RESULT'] === 1) {//success
                        $rootScope.loadList();
                        $scope.stock.init();
                        $('.stock-delete-modal:first').modal('hide');
                        app.show.success('Stok silindi!');
                        return;
                    }

                   

                    app.show.error('Bir şeyler ters gitti...');
                }, function (response) {
                    console.log(response);
                    app.show.error('Bir şeyler ters gitti...');
                    app.hide.spinner($('stock-delete-modal > div:first > div:first'));
                });
            }
        };
    }]
});