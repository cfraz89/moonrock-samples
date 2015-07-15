var axios = require('axios');
var Rx = require('rx');
function toNumber(source) {
    var num = parseInt(source);
    return isNaN(num) ? 0 : num;
}
var appModule = (function () {
    function appModule() {
    }
    appModule.prototype.portalsGenerated = function () {
        var add1Num = this.add1Text.map(toNumber);
        var add2Num = this.add2Text.map(toNumber);
        var sumStream = add1Num.combineLatest(add2Num, function (num1, num2) { return (num1 + num2).toString(); });
        this.sum = this.addPressed.withLatestFrom(sumStream, function (ev, num) { return num; });
        this.posts = Rx.Observable.fromPromise(axios.get('http://jsonplaceholder.typicode.com/posts'));
    };
    appModule.prototype.portalsLinked = function () { };
    appModule.prototype.destroy = function () { };
    return appModule;
})();
exports.appModule = appModule;
exports.default = (new appModule());
