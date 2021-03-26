app.angular
.controller('productDeleteModalCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $rootScope.showDeleteModal = function (productData) {
        $scope.product.set(productData);
        $('.product-delete-modal:first').modal({
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
            value: '',
            init: function () {
                $scope.product.name.value = '';
            },
            set: function (value) {
                $scope.product.name.value = value;
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
        delete: function () {
            app.show.spinner($('product-delete-modal > div:first > div:first'));
            $http({
                method: 'POST',
                url: 'services/product.ashx?&t=5&d=' + new Date(),
                data: {
                    productid: $scope.product.id.value
                }
            }).then(function (response) {
                app.hide.spinner($('product-delete-modal > div:first > div:first'));
                if (!response.data.hasOwnProperty('RESULT')) {
                    app.show.error('Bir şeyler ters gitti...');
                    return;
                }
                if (response.data['RESULT'] === 1) {//success
                    $rootScope.loadList();
                    $scope.product.init();
                    $('.product-delete-modal:first').modal('hide');
                    app.show.success('Ürün silindi!');
                    return;
                }
                
                app.show.error('Bir şeyler ters gitti...');
            }, function (response) {
                console.log(response);
                    app.show.error('Bir şeyler ters gitti...');
                    app.hide.spinner($('product-delete-modal > div:first > div:first'));
            });
        }
    };
}])
.directive('productDeleteModal', function () {
    return {
        restrict: 'E',
        templateUrl: 'assets/template/product-delete-modal.html'
    };
});