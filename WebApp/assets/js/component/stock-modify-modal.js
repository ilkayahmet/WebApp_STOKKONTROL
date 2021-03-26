app.angular
.component('stockModifyModal', {
    templateUrl: 'assets/template/stock-modify-modal.html',
    controller: ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
        $rootScope.showModifyModal = function (stockData) {
            $scope.stock.set(stockData);
            $('.stock-modify-modal:first').modal({
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
                isValid: false,
                selected: null,
                cls: '',
                msg: '',
                inputValue: '',
                shouldLoadOptionsOnInputFocus: true,
                init: function () {
                    $scope.stock.product.isValid = false;
                    $scope.stock.product.selected = null;
                    $scope.stock.product.cls = '';
                    $scope.stock.product.msg = '';
                    $scope.stock.product.inputValue = '';
                    $scope.stock.product.shouldLoadOptionsOnInputFocus = true;
                },
                check: function (applyCheck) {
                    var check = $scope.stock.product.selected && $scope.stock.product.selected.hasOwnProperty('UUID') && typeof $scope.stock.product.selected.UUID !== 'undefined' && $scope.stock.product.selected.UUID != null ? true : false;
                    if (applyCheck || $scope.stock.product.isValid !== check) {
                        $scope.stock.product.isValid = check;
                        if ($scope.stock.product.isValid) {
                            $scope.stock.product.success();
                        } else {
                            $scope.stock.product.error('* Geçersiz Ürün!');
                        }
                    }
                    return $scope.stock.product.isValid;
                },
                set: function (product) {
                    $scope.stock.product.isValid = false;
                    $scope.stock.product.selected = product;
                    $scope.stock.product.cls = '';
                    $scope.stock.product.msg = '';
                    $scope.stock.product.inputValue = product.NAME;
                    $scope.stock.product.shouldLoadOptionsOnInputFocus = true;
                },
                select: function (product) {
                    $scope.stock.product.selected = product;
                    $scope.stock.product.check();
                },
                success: function () {
                    $scope.stock.product.cls = '';
                    $scope.stock.product.msg = '';
                },
                error: function (msg) {
                    $scope.stock.product.cls = 'has-error';
                    $scope.stock.product.msg = msg;
                }
            },
            quantity: {
                isValid: false,
                text: '',
                value: 0,
                cls: '',
                msg: '',
                init: function () {
                    $scope.stock.quantity.isValid = false;
                    $scope.stock.quantity.text = '';
                    $scope.stock.quantity.value = 0;
                    $scope.stock.quantity.cls = '';
                    $scope.stock.quantity.msg = '';
                },
                check: function (applyCheck) {
                    $scope.stock.quantity.value = $scope.stock.quantity.text.format();
                    var check = app.valid.positiveNumber($scope.stock.quantity.value, true);
                    if (applyCheck || $scope.stock.quantity.isValid !== check) {
                        $scope.stock.quantity.isValid = check;
                        if ($scope.stock.quantity.isValid) {
                            $scope.stock.quantity.success();
                        } else {
                            $scope.stock.quantity.error('* Geçersiz Miktar');
                        }
                    }
                    return $scope.stock.quantity.isValid;
                },
                change: function () {
                    $scope.stock.quantity.text = $scope.stock.quantity.text.replace(/[^0-9.,]+/, '');
                    $scope.stock.quantity.check();
                },
                success: function () {
                    $scope.stock.quantity.cls = '';
                    $scope.stock.quantity.msg = '';
                },
                error: function (msg) {
                    $scope.stock.quantity.cls = 'has-error';
                    $scope.stock.quantity.msg = msg;
                },
                set: function (quantity) {
                    $scope.stock.quantity.value = quantity.value;
                    $scope.stock.quantity.text = quantity.text;
                    $scope.stock.quantity.isValid = true;
                    $scope.stock.quantity.cls = '';
                    $scope.stock.quantity.msg = '';
                }
            },
            utype: {
                list: page.data.unittypes,
                isValid: false,
                selected: { name: "Adet", value: 0 },
                cls: '',
                msg: '',
                init: function () {
                    $scope.stock.utype.isValid = false;
                    $scope.stock.utype.selected = null;
                    $scope.stock.utype.cls = '';
                    $scope.stock.utype.msg = '';
                },
                check: function (applyCheck) {
                    var check = $scope.stock.utype.selected && $scope.stock.utype.selected.hasOwnProperty('value') && typeof $scope.stock.utype.selected.value !== 'undefined' && $scope.stock.utype.selected.value != null ? true : false;
                    if (applyCheck || $scope.stock.utype.isValid !== check) {
                        $scope.stock.utype.isValid = check;
                        if ($scope.stock.utype.isValid) {
                            $scope.stock.utype.success();
                        } else {
                            $scope.stock.utype.error('* Geçersiz Stok Birimi!');
                        }
                    }
                    return $scope.stock.utype.isValid;
                },
                select: function (item) {
                    $scope.stock.utype.isValid = true;
                    $scope.stock.utype.selected = item;
                    $scope.stock.utype.cls = '';
                    $scope.stock.utype.msg = '';
                },
                set: function (value) {
                    var goon = true;
                    var i = 0;
                    while (goon && i < $scope.stock.utype.list.length) {
                        if ($scope.stock.utype.list[i].value === value) {
                            $scope.stock.utype.select($scope.stock.utype.list[i]);
                            goon = false;
                        }
                        i++;
                    }
                    if (goon) {
                        $scope.stock.utype.init();
                    }
                },
                change: function () {
                    $scope.stock.utype.check();
                },
                success: function () {
                    $scope.stock.utype.cls = '';
                    $scope.stock.utype.msg = '';
                },
                error: function (msg) {
                    $scope.stock.utype.cls = 'has-error';
                    $scope.stock.utype.msg = msg;
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
                $scope.stock.utype.set(stockData.UNITVAL);
                $scope.stock.comment.set(stockData.COMMENT);
                var productData = {
                    UUID: stockData.UUID,
                    NAME: stockData.P_NAME
                };
                $scope.stock.product.set(productData);
            },
            init: function () {
                $scope.stock.id.init();
                $scope.stock.product.init();
                $scope.stock.quantity.init();
                $scope.stock.utype.init();
                $scope.stock.comment.init();
            },
            check: function () {
                var applyCheck = true;
                var OK = {
                    product: $scope.stock.product.check(applyCheck),
                    quantity: $scope.stock.quantity.check(applyCheck),
                    utype: $scope.stock.utype.check(applyCheck)
                };
                return OK.product && OK.quantity && OK.utype;
            },
            modify: function () {
                if (!$scope.stock.check()) {
                    return;
                }
                app.show.spinner($('stock-modify-modal > div:first > div:first'));
                $http({
                    method: 'POST',
                    url: 'services/stock.ashx?&t=4&d=' + new Date(),
                    data: {
                        id: $scope.stock.id.value,
                        productid: $scope.stock.product.selected.UUID,
                        quantity: $scope.stock.quantity.value,
                        unit: $scope.stock.utype.selected.value,
                        comment: $scope.stock.comment.value
                    }
                }).then(function (response) {
                    app.hide.spinner($('stock-modify-modal > div:first > div:first'));
                    if (!response.data.hasOwnProperty('RESULT')) {
                        app.show.error('Bir şeyler ters gitti...');
                        return;
                    }

                    if (response.data['RESULT'] === 1) {//success
                        $rootScope.loadList();
                        $scope.stock.init();
                        $('.stock-modify-modal:first').modal('hide');
                        app.show.success('Stok güncellendi!');
                        return;
                    }

                    if (response.data['RESULT'] === 6) {
                        $scope.stock.product.isValid = false;
                        $scope.stock.product.error('* Geçersiz Ürün');
                        return;
                    }

                    if (response.data['RESULT'] === 10) {
                        $scope.stock.quantity.isValid = false;
                        $scope.stock.quantity.error('* Geçersiz Miktar');
                        return;
                    }
                    if (response.data['RESULT'] === 11) {
                        $scope.stock.utype.isValid = false;
                        $scope.stock.utype.error('* Geçersiz Stok Birimi');
                        return;
                    }

                    app.show.error('Bir şeyler ters gitti...');
                }, function (response) {
                    console.log(response);
                    app.show.error('Bir şeyler ters gitti...');
                    app.hide.spinner($('stock-modify-modal > div:first > div:first'));
                });
            }
        };
    }]
});