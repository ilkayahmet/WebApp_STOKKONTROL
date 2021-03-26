app.angular
.controller('productCreateModalCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.product = {
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
            }
        },
        init: function () {
            $scope.product.name.init();
            $scope.product.comment.init();
        },
        check: function () {
            var applyCheck = true;
            var OK = {
                name: $scope.product.name.check(applyCheck)
            };
            return OK.name;
        },
        save: function () {
            if (!$scope.product.check()) {
                return;
            }
            app.show.spinner($('product-create-modal > div:first > div:first'));
            $http({
                method: 'POST',
                url: 'services/product.ashx?&t=3&d=' + new Date(),
                data: {
                    name: $scope.product.name.value,
                    comment: $scope.product.comment.value
                }
            }).then(function (response) {
                app.hide.spinner($('product-create-modal > div:first > div:first'));
                if (!response.data.hasOwnProperty('RESULT')) {
                    app.show.error('Bir şeyler ters gitti...');
                    return;
                }
                if (response.data['RESULT'] === 1) {//success
                    $scope.product.init();
                    app.show.success('Yeni ürün oluşturuldu!');
                    $rootScope.loadList();
                    return;
                }
                if (response.data['RESULT'] === 8 || response.data['RESULT'] === 6) {
                    window.location.href = 'login.aspx';
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
                app.hide.spinner($('product-create-modal > div:first > div:first'));
            });
        }
    };
}])
.directive('productCreateModal', function () {
    return {
        restrict: 'E',
        templateUrl: 'assets/template/product-create-modal.html'
    };
});