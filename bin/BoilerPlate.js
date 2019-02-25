"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Path = require("path");
var chalk_1 = require("chalk");
var Files_1 = require("./Files");
var child_process_1 = require("child_process");
var BoilerPlate = /** @class */ (function () {
    function BoilerPlate() {
    }
    BoilerPlate.build = function (workingDirectory) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, error_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 4, , 5]);
                        _b = (_a = Promise).all;
                        _c = [this.createFile(workingDirectory, 'tsconfig.json', Files_1.TsConfig),
                            this.createFile(workingDirectory, 'tslint.json', Files_1.TsLint),
                            this.createFile(workingDirectory, '.gitignore', Files_1.GitIgnore),
                            this.createDirectory(workingDirectory, 'src'),
                            this.createDirectory(workingDirectory, 'dist'),
                            this.createDirectory(workingDirectory, 'tests')];
                        _d = this.createFile;
                        _e = [workingDirectory, 'package.json'];
                        return [4 /*yield*/, Files_1.Package()];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                                _d.apply(this, _e.concat([_f.sent()]))
                            ])])];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, Promise.all([
                                this.execute("npm install"),
                                this.execute("git init")
                            ])];
                    case 3:
                        _f.sent();
                        this.log(chalk_1.default.green("Successfully created a basic typescript project!"));
                        process.exit(1);
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _f.sent();
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BoilerPlate.createDirectory = function (workingDirectory, filePath) {
        var _this = this;
        var path = Path.join(workingDirectory, filePath);
        this.logDir(path);
        return new Promise(function (resolve, reject) {
            fs.stat(path, function (error, stats) {
                if (error) {
                    _this.makeDirectory(path, resolve, reject);
                }
                if (stats != null && stats.isDirectory()) {
                    _this.log(chalk_1.default.yellow("Directory already exists: '" + path + "'"));
                }
            });
        });
    };
    BoilerPlate.makeDirectory = function (path, resolve, reject) {
        fs.mkdir(path, function (error) {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    };
    BoilerPlate.createFile = function (workingDirectory, filePath, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var path = Path.join(workingDirectory, filePath);
            _this.logFile(path);
            fs.stat(path, function (error, stats) {
                if (error) {
                    _this.writeFile(path, data, resolve, reject);
                }
                if (stats != null && stats.isFile()) {
                    _this.log(chalk_1.default.yellow("File already exists: '" + path + "'"));
                }
            });
        });
    };
    BoilerPlate.writeFile = function (path, data, resolve, reject) {
        fs.writeFile(path, data, function (error) {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    };
    BoilerPlate.execute = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var process = child_process_1.exec(command);
                        process.on('exit', function () {
                            if (!process.killed) {
                                process.kill();
                            }
                            _this.log(chalk_1.default.green("Successfully executed command: '" + command + "'"));
                            resolve();
                        });
                        process.on('error', function (error) {
                            if (!process.killed) {
                                process.kill();
                            }
                            _this.log(chalk_1.default.red("Failed to execute command: '" + command + "'"));
                            reject(error);
                        });
                    })];
            });
        });
    };
    BoilerPlate.logFile = function (path) {
        this.log(chalk_1.default.green("Wrote file: '" + path + "'"));
    };
    BoilerPlate.logDir = function (path) {
        this.log(chalk_1.default.green("Wrote dir: '" + path + "'"));
    };
    BoilerPlate.log = function (data) {
        process.stdout.write(data + '\n');
    };
    return BoilerPlate;
}());
exports.default = BoilerPlate;
//# sourceMappingURL=BoilerPlate.js.map