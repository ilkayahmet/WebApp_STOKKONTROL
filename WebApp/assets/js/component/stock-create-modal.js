app.angular
.component('stockCreateModal', {
    templateUrl: 'assets/template/stock-create-modal.html',
    controller: ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
        $scope.stock = {
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
            init: function () {
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
            save: function () {
                if (!$scope.stock.check()) {
                    return;
                }
                app.show.spinner($('stock-create-modal > div:first > div:first'));
                $http({
                    method: 'POST',
                    url: 'services/stock.ashx?&t=3&d=' + new Date(),
                    data: {
                        productid: $scope.stock.product.selected.UUID,
                        quantity: $scope.stock.quantity.value,
                        unit: $scope.stock.utype.selected.value,
                        comment: $scope.stock.comment.value
                    }
                }).then(function (response) {
                    app.hide.spinner($('stock-create-modal > div:first > div:first'));
                    if (!response.data.hasOwnProperty('RESULT')) {
                        app.show.error('Bir şeyler ters gitti...');
                        return;
                    }

                    if (response.data['RESULT'] === 1) {//success
                        $scope.stock.init();
                        $('.stock-create-modal:first').modal('hide');
                        app.show.success('Yeni stok oluşturuldu!');
                        $rootScope.loadList();
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
                    app.hide.spinner($('stock-create-modal > div:first > div:first'));
                });
            }
        };
    }]
});