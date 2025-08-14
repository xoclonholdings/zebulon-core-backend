"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.default = AuthPage;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var useAuth_1 = require("@/hooks/useAuth");
var useWallet_1 = require("@/hooks/useWallet");
var lucide_react_1 = require("lucide-react");
var wouter_1 = require("wouter");
var use_toast_1 = require("@/hooks/use-toast");
function AuthPage() {
    var _this = this;
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, isLoading = _a.isLoading;
    var _b = (0, useWallet_1.useWallet)(), connectWallet = _b.connectWallet, isConnecting = _b.isConnecting;
    var _c = (0, wouter_1.useLocation)(), setLocation = _c[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var _d = (0, react_1.useState)(false), showAdminLogin = _d[0], setShowAdminLogin = _d[1];
    var _e = (0, react_1.useState)(""), adminPassword = _e[0], setAdminPassword = _e[1];
    var _f = (0, react_1.useState)(false), showPassword = _f[0], setShowPassword = _f[1];
    var _g = (0, react_1.useState)(false), isAdminLogging = _g[0], setIsAdminLogging = _g[1];
    (0, react_1.useEffect)(function () {
        if (!isLoading && user) {
            setLocation("/");
        }
    }, [user, isLoading, setLocation]);
    if (isLoading) {
        return (<div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>);
    }
    var handleSocialLogin = function (provider) {
        window.location.href = "/api/auth/".concat(provider);
    };
    var handleWalletConnect = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, connectWallet()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Wallet connection failed:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleAdminLogin = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!adminPassword.trim()) {
                        toast({
                            title: "Password Required",
                            description: "Please enter the admin password",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    setIsAdminLogging(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch('/api/auth/admin', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ password: adminPassword }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    toast({
                        title: "Admin Access Granted",
                        description: "Redirecting to dashboard...",
                    });
                    setLocation("/dashboard");
                    return [3 /*break*/, 5];
                case 4:
                    toast({
                        title: "Access Denied",
                        description: "Invalid admin password",
                        variant: "destructive",
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_2 = _a.sent();
                    toast({
                        title: "Login Failed",
                        description: "Unable to connect to server",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 8];
                case 7:
                    setIsAdminLogging(false);
                    setAdminPassword("");
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 cursor-pointer hover:bg-blue-500 transition-colors" onClick={function () { return setShowAdminLogin(!showAdminLogin); }} title="Admin Access">
            <lucide_react_1.Shield className="h-8 w-8 text-white"/>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Fantasma Firewall</h1>
          <p className="text-gray-400">Choose your authentication method</p>
        </div>

        <div className="space-y-4">
          <button_1.Button onClick={handleWalletConnect} disabled={isConnecting} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg disabled:opacity-50">
            {isConnecting ? "Connecting..." : "Connect Web3 Wallet"}
          </button_1.Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700"/>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-900 px-3 text-gray-500">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <button_1.Button onClick={function () { return handleSocialLogin('twitter'); }} className="w-full bg-gray-700 hover:bg-gray-600 text-white h-11">
              <lucide_react_1.Twitter className="h-4 w-4 mr-2"/>
              Continue with X
            </button_1.Button>

            <button_1.Button onClick={function () { return handleSocialLogin('instagram'); }} className="w-full bg-gray-700 hover:bg-gray-600 text-white h-11">
              <lucide_react_1.Instagram className="h-4 w-4 mr-2"/>
              Continue with Instagram
            </button_1.Button>

            <button_1.Button onClick={function () { return handleSocialLogin('snapchat'); }} className="w-full bg-gray-700 hover:bg-gray-600 text-white h-11">
              <span className="mr-2">👻</span>
              Continue with Snapchat
            </button_1.Button>
          </div>
        </div>

        {showAdminLogin && (<div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Admin Access</h3>
            <div className="space-y-3">
              <div className="relative">
                <input_1.Input type={showPassword ? "text" : "password"} placeholder="Admin password" value={adminPassword} onChange={function (e) { return setAdminPassword(e.target.value); }} onKeyPress={function (e) { return e.key === 'Enter' && handleAdminLogin(); }} className="bg-gray-700 border-gray-600 text-white pr-10"/>
                <button type="button" onClick={function () { return setShowPassword(!showPassword); }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <lucide_react_1.EyeOff className="h-4 w-4"/> : <lucide_react_1.Eye className="h-4 w-4"/>}
                </button>
              </div>
              <button_1.Button onClick={handleAdminLogin} disabled={isAdminLogging} className="w-full bg-red-600 hover:bg-red-700 text-white">
                {isAdminLogging ? "Authenticating..." : "Admin Login"}
              </button_1.Button>
            </div>
          </div>)}

        <p className="text-xs text-gray-500 text-center">
          Secure authentication for ZEBULON Web3 Interface
        </p>
      </div>
    </div>);
}
