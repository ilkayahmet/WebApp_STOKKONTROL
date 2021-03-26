app.angular
.controller('productModifyModalCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $rootScope.showModifyModal = function (productData) {
        $scope.product.set(productData);
        $('.product-modify-modal:first').modal({
            backdrop: 'static'
        });
    };
    $scope.product = {
        rawdata: null,
        id: {
            value: 0,
            init: function () {
                $scope.product.id.set(0);
            },
            set: function (value) {
                $scope.product.id.value = value;
            }
        },
        name: {
            isValid: false,
            value: '',
            cls: '',
            msg: '',
            init: function () {
                $scope.product.name.isValid = false;
                $scope.product.name.value = '';
                $scope.product.name.cls = '';
                $scope.product.name.msg = '';
            },
            set: function (value) {
                $scope.product.name.value = value;
                $scope.product.name.isValid = true;
                $scope.product.name.cls = '';
                $scope.product.name.msg = '';
            },
            check: function (applyCheck) {
                var check = app.valid.text($scope.product.name.value);
                if (applyCheck || $scope.product.name.isValid !== check) {
                    $scope.product.name.isValid = check;
                    if ($scope.product.name.isValid) {
                        $scope.product.name.success();
                    } else {
                        $scope.product.name.error('* Geçersiz Ürün Adı');
                    }
                }
                return $scope.product.name.isValid;
            },
            change: function () {
                $scope.product.name.check();
            },
            success: function () {
                $scope.product.name.cls = '';
                $scope.product.name.msg = '';
            },
            error: function (msg) {
                $scope.product.name.cls = 'has-error';
                $scope.product.name.msg = msg;
            }
        },
        comment: {
            value: '',
            init: function () {
                $scope.product.comment.value = '';
            },
            set: function (value) {
                $scope.product.comment.value = value;
            },
        },
        set: function (productData) {
            $scope.product.rawdata = productData;
            $scope.product.id.set(productData.UUID);
            $scope.product.name.set(productData.NAME);
            $scope.product.comment.set(productData.COMMENT);
        },
        init: function () {
            $scope.product.id.init();
            $scope.product.name.init();
            $scope.product.comment.init();
            $scope.product.rawdata = null;
        },
        check: function () {
            var applyCheck = true;
            var OK = {
                name: $scope.product.name.check(applyCheck)
            };
            return OK.name;
        },
        modify: function () {
            if (!$scope.product.check()) {
                return;
            }
            app.show.spinner($('product-modify-modal > div:first > div:first'));
            $http({
                method: 'POST',
                url: 'services/product.ashx?&t=4&d=' + new Date(),
                data: {
                    productid: $scope.product.id.value,
                    name: $scope.product.name.value,
                    comment: $scope.product.comment.value
                }
            }).then(function (response) {
                app.hide.spinner($('product-modify-modal > div:first > div:first'));
                if (!response.data.hasOwnProperty('RESULT')) {
                    app.show.error('Bir şeyler ters gitti...');
                    return;
                }
                if (response.data['RESULT'] === 1) {//success
                    $rootScope.loadList();
                    $scope.product.init();
                    $('.product-modify-modal:first').modal('hide');
                    app.show.success('Ürün güncellendi!');
                    return;
                }
                if (response.data['RESULT'] === 8) {//name is invalid
                    $scope.product.name.isValid = false;
                    $scope.product.name.error('* Geçersiz Ürün Adı');
                    return;
                }
                
                app.show.error('Bir şeyler ters gitti...');
            }, function (response) {
                console.log(response);
                    app.show.error('Bir şeyler ters gitti...');
                app.hide.spinner($('product-modify-modal > div:first > div:first'));
            });
        }
    };
}])
.directive('productModifyModal', function () {
    return {
        restrict: 'E',
        templateUrl: 'assets/template/product-modify-modal.html'
    };
});