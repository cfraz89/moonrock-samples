var Rx = require('rx');
var MRHelper = (function () {
    function MRHelper() {
        this.window = window;
    }
    MRHelper.prototype.getModule = function (loadedName) {
        return this.window[loadedName];
    };
    MRHelper.prototype.getSubject = function (moduleName, subjectName) {
        return this.getModule(moduleName)[subjectName];
    };
    MRHelper.prototype.getObservable = function (moduleName, subjectName) {
        return this.getModule(moduleName)[subjectName];
    };
    MRHelper.prototype.loadModule = function (moduleName, loadedName) {
        var _this = this;
        System.import(moduleName).then(function (mod) {
            _this.window[loadedName] = mod.default;
            streamInterface.push(true, loadedName);
        });
    };
    MRHelper.prototype.portal = function (loadedName, subjectName) {
        if (this.getSubject(loadedName, subjectName) == undefined) {
            var portal = new Rx.Subject();
            this.getModule(loadedName)[subjectName] = portal;
        }
    };
    MRHelper.prototype.activatePortal = function (loadedName, subjectName, serializedInput) {
        var data = JSON.parse(serializedInput);
        this.getSubject(loadedName, subjectName).onNext(data);
    };
    MRHelper.prototype.reversePortal = function (loadedName, subjectName) {
        this.getObservable(loadedName, subjectName).subscribe(function (data) {
            reversePortalInterface.onNext(JSON.stringify(data), subjectName);
        });
    };
    MRHelper.prototype.portalsGenerated = function (loadedName) {
        this.getModule(loadedName).portalsGenerated();
    };
    MRHelper.prototype.portalsLinked = function (loadedName) {
        this.getModule(loadedName).portalsLinked();
    };
    MRHelper.prototype.unloadModule = function (loadedName) {
        this.getModule(loadedName).destroy();
        this.window[loadedName] = null;
    };
    return MRHelper;
})();
exports.MRHelper = MRHelper;
