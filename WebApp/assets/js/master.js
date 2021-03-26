String.prototype.format = function () {
    if (this === null || typeof this === 'undefined') {
        return this;
    }
    var val = this.toString();
    var regex = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\.[0-9]{1,2})?$/;
    val = val.replace(/[^0-9,]/g, '').replace(/[^0-9.]/g, '.');
    if (regex.test(val)) {
        return parseFloat(val);
    } else if (!isNaN(val) && val !== '') {
        return parseFloat(val);
    } else {
        return null;
    }
};
Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

String.prototype.tryParseMoneyToFloat = function () {
    if (this === null || typeof this === 'undefined') {
        return this;
    }
    var val = this.toString();
    var regex = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\.[0-9]{1,2})?$/;
    val = val.replace(/[^0-9,]/g, '').replace(/[^0-9.]/g, '.');
    if (regex.test(val)) {
        return parseFloat(val);
    } else if (!isNaN(val) && val !== '') {
        return parseFloat(val);
    } else {
        return null;
    }
};

String.prototype.stringToDate = function () {
    if (this === null || typeof this === 'undefined') {
        return null;
    }
    var separator;
    if (value.indexOf('.') !== -1) {
        separator = '.';
    } else if (value.indexOf('/') !== -1) {
        separator = '/';
    }
    if (typeof separator === 'undefined') {
        return null;
    }
    var dateArray = value.split(separator);
    if (dateArray.length !== 3) {
        return null;
    }

    if (!app.valid.positiveInteger(dateArray[0]) || !app.valid.positiveInteger(dateArray[1]) || !app.valid.positiveInteger(dateArray[2])) {
        return null;
    }
    var day = parseInt(dateArray[0]);
    var month = parseInt(dateArray[1]);
    var year = parseInt(dateArray[2]);
    switch (month) {
        case 1://January
        case 3://March
        case 5://May
        case 7://July
        case 8://August
        case 10://October
        case 12://December
            if (day > 31) {
                return null;
            }
            break;
        case 4://April
        case 6://June
        case 9://September
            if (day > 30) {
                return null;
            }
            break;
        case 2://February
            if ((year % 4 !== 0 && day > 28) || day > 29) {
                return null;
            }
            break;
        default: return null;
    }
    return new Date(year, --month, day);
};

var app = {
    angular: angular.module('stoktakip', ['ngSanitize']),
    show: {
        spinner: function (elem) {
            $(elem).block({
                message: '<i class="icon-spinner2 spinner"></i>',
                overlayCSS: {
                    backgroundColor: '#fff',
                    opacity: 0.8,
                    cursor: 'wait'
                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: 'none'
                }
            });
        },
        error: function (msg, callback) {
            swal({
                title: "Hay aksi...",
                text: msg,
                confirmButtonColor: "#EF5350",
                confirmButtonText: "Tamam",
                type: "error"
            }, callback);
        },
        warning: function (titlemsg, msg, callback) {
            swal({
                title: titlemsg,
                text: msg,
                confirmButtonColor: "#FF7043",
                confirmButtonText: "Tamam",
                type: "warning"
            }, callback);
        },
        success: function (msg, callback) {
            swal({
                title: "İşlem başarılı!",
                text: msg,
                confirmButtonColor: "#66BB6A",
                confirmButtonText: "Tamam",
                type: "success"
            }, callback);
        }
    },
    hide: {
        spinner: function (elem) {
            $(elem).unblock();
        }
    },
    valid: {
        text: function (value) {
            return typeof value != 'undefined' && value != null && value !== '';
        },
        positiveNumber: function (value, includeZero) {
            if (typeof value != 'number') {
                return false;
            }
            return includeZero ? value >= 0 : value > 0;
        },
        positiveInteger: function (value, includeZero) {
            if (isNaN(value)) {
                return false;
            }
            var num = parseFloat(value);
            return ((num | 0) === num) && (includeZero ? num >= 0 : num > 0);
        },
        date: function (value) {
            if (typeof value === 'string') {
                value = new Date(value);
            }
            return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.valueOf());
        }
    },
    language:{
        filter: function (inputTR, inputAR) {
            return document.documentElement.lang === 'ar' ? inputAR : inputTR;
        }
    },
    pagination: {
        maxVisible: {
            row: 20,
            pageIndex: 6
        }
    }
};

app.angular.filter('filterMultiple', ['$filter', function ($filter) {
    return function (items, keyObj) {
        var filterObj = {
            data: items,
            filteredData: [],
            applyFilter: function (obj, key) {
                var fData = [];
                if (this.filteredData.length == 0)
                    this.filteredData = this.data;
                if (obj) {
                    var fObj = {};
                    if (!angular.isArray(obj)) {
                        fObj[key] = obj;
                        fData = fData.concat($filter('filter')(this.filteredData, fObj));
                    } else if (angular.isArray(obj)) {
                        if (obj.length > 0) {
                            for (var i = 0; i < obj.length; i++) {
                                if (angular.isDefined(obj[i])) {
                                    fObj[key] = obj[i];
                                    fData = fData.concat($filter('filter')(this.filteredData, fObj));
                                }
                            }
                        }
                    }
                    if (fData.length >= 0) {
                        this.filteredData = fData;
                    }
                }
            }
        };

        if (keyObj) {
            angular.forEach(keyObj, function (obj, key) {
                filterObj.applyFilter(obj, key);
            });
        }

        return filterObj.filteredData;
    }
}]);

window.onload = function () {
    $("input[type=text]").on("keypress", function (e) {
        if (e.key === "'" || e.key === "\"" || e.key === "/" || e.key === "\\") {
            return false;
        }
    });
}