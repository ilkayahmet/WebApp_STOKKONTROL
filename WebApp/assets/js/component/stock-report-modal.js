app.angular
.controller('stockReportModalCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
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
        init: function () {
            $scope.stock.product.init();
        },
        check: function () {
            var applyCheck = true;
            var OK = {
                product: $scope.stock.product.check(applyCheck)
            };
            return OK.product;
        },
        tableToExcel: (function () {
            var uri = 'data:application/vnd.ms-excel;charset=UTF-8;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
            , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
            return function (table, name, filename) {
                var ctx = { worksheet: name || 'Worksheet', table: $scope.stock.dataToInnerTable() };
                var blobData = new Blob([format(template, ctx)], { type: 'application/vnd.ms-excel' });
                document.getElementById("dlink").href = window.URL.createObjectURL(blobData);
                document.getElementById("dlink").download = filename;
                document.getElementById("dlink").click();

            }
        })(),
        dataToInnerTable: function () {
            var thead =
                "<thead><tr><th>" + "Ürün Adı" +
                "</th><th>" + "Miktarı" +
                "</th><th>" + "Birimi" +
                "</th><th>" + "Açıklama" +
                "</th><th>" + "Oluşturulma Tarihi" +
                "</th><th>" + "Düzenlenme Tarihi" +
                "</th></tr></thead>";
            var tbody = "<tbody>";
            for (var i = 0; i < $scope.stock.list.length; i++) {
                var tr =
                    "<tr><td>" + $scope.stock.list[i].P_NAME +
                        "</td><td>" + $scope.stock.list[i].QUANTITYTXT +
                        "</td><td>" + $scope.stock.list[i].UNITTXT +
                        "</td><td>" + $scope.stock.list[i].COMMENT +
                        "</td><td>" + $scope.stock.list[i].CREATEDATETXT +
                        "</td><td>" + $scope.stock.list[i].MODIFYDATETXT +
                        "</td></tr>";
                tbody += tr;
            }
            tbody += "</tbody>";
            return thead + tbody;
        },
        isExist: false,
        save: function () {
            if (!$scope.stock.check()) {
                return;
            }
            app.show.spinner($('stock-report-modal > div:first > div:first'));
            $http({
                method: 'POST',
                url: 'services/stock.ashx?&t=6&d=' + new Date(),
                data: {
                    productid: $scope.stock.product.selected.UUID
                }
            }).then(function (response) {
                if (!response.data.hasOwnProperty('RESULT')) {
                    app.show.error('Bir şeyler ters gitti...');
                    app.hide.spinner($('stock-report-modal > div:first > div:first'));
                    return;
                }
                if (response.data['RESULT'] === 1) {//success
                    $scope.stock.list = response.data.LIST;
                    $scope.stock.isExist = $scope.stock.list.length > 0;
                    $scope.stock.create();
                    app.hide.spinner($('stock-report-modal > div:first > div:first'));
                    return;
                }
                $scope.stock.isExist = $scope.stock.list.length > 0;
                
            }, function (response) {
                    console.log(response);
                    app.show.error('Bir şeyler ters gitti...');
                $('#saveinreportbtn').attr("disabled", false);
            });
        },
        create: function () {
            if (!$scope.stock.check()) {
                return;
            }

            if ($scope.stock.isExist) {
                var stockDate = new Date();
                var yearTxt = stockDate.getFullYear();
                var montTxt = (stockDate.getMonth() < 9 ? '0' : '') + (stockDate.getMonth() + 1);
                var dayTxt = (stockDate.getDate() < 10 ? '0' : '') + stockDate.getDate();
                var filename = 'StockReport_' + dayTxt + '-' + montTxt + '-' + yearTxt+'.xls';
                $scope.stock.tableToExcel('ReportTable', 'ExcelReportPage', filename);
                app.show.success('Rapor Oluşturuldu!');
                $scope.stock.init();
                $('.stock-report-modal:first').modal('hide');
            }
            else {
                app.show.warning('UYARI', 'Seçtiğiniz ürüne ait stok kaydı yoktur.');
            }
        }
    };
}])
.directive('stockReportModal', function () {
    return {
        restrict: 'E',
        templateUrl: 'assets/template/stock-report-modal.html'
    };
});

