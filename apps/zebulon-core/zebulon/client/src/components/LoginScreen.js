"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var button_1 = require("@/components/ui/button");
var label_1 = require("@/components/ui/label");
var alert_1 = require("@/components/ui/alert");
var Zed_ai_logo_1753441894358_png_1 = require("@assets/Zed-ai-logo_1753441894358.png");
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
var LoginScreen = function (_a) {
    var onLoginSuccess = _a.onLoginSuccess;
    var _b = (0, react_1.useState)(false), isSignUp = _b[0], setIsSignUp = _b[1];
    var _c = (0, react_1.useState)(false), showPassword = _c[0], setShowPassword = _c[1];
    var _d = (0, react_1.useState)({
        username: '',
        password: '',
        email: ''
    }), formData = _d[0], setFormData = _d[1];
    var _e = (0, react_1.useState)(''), error = _e[0], setError = _e[1];
    var loginMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/auth/login', {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: { 'Content-Type': 'application/json' }
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error(error_1);
                    case 3: return [4 /*yield*/, response.json()];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function (user) {
            setError('');
            onLoginSuccess(user);
        },
        onError: function (error) {
            setError(error.message || 'Login failed');
        }
    });
    var signUpMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/auth/signup', {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: { 'Content-Type': 'application/json' }
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error(error_2);
                    case 3: return [4 /*yield*/, response.json()];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function (user) {
            setError('');
            onLoginSuccess(user);
        },
        onError: function (error) {
            setError(error.message || 'Sign up failed');
        }
    });
    var handleSubmit = function (e) {
        e.preventDefault();
        setError('');
        if (!formData.username || !formData.password) {
            setError('Username and password are required');
            return;
        }
        if (isSignUp) {
            signUpMutation.mutate(formData);
        }
        else {
            loginMutation.mutate({
                username: formData.username,
                password: formData.password
            });
        }
    };
    var handleInputChange = function (e) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[e.target.name] = e.target.value, _a)));
        });
    };
    var isLoading = loginMutation.isPending || signUpMutation.isPending;
    return (<div className="min-h-screen bg-black text-white flex items-center justify-center p-4" style={{ backgroundColor: '#000000' }}>
      <card_1.Card className="w-full max-w-md border border-gray-800 rounded-2xl" style={{ backgroundColor: '#000000' }}>
        <card_1.CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-2">
            <img src={Zed_ai_logo_1753441894358_png_1.default} alt="Zebulon Oracle Logo" className="w-24 h-24 object-contain opacity-90"/>
          </div>
          <card_1.CardTitle className="text-3xl font-extrabold mb-3 tracking-wide" style={{
            color: '#ffffff',
            textShadow: '0 0 15px rgba(168, 85, 247, 0.4), 0 0 30px rgba(168, 85, 247, 0.2)',
            background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #ffffff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
            ZEBULON
          </card_1.CardTitle>
          <p className="text-gray-200 text-base font-medium" style={{ color: '#e5e7eb' }}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </card_1.CardHeader>

        <card_1.CardContent className="space-y-6">
          {error && (<alert_1.Alert variant="destructive">
              <alert_1.AlertDescription>{error}</alert_1.AlertDescription>
            </alert_1.Alert>)}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label_1.Label htmlFor="username">Username</label_1.Label>
              <input_1.Input id="username" name="username" type="text" value={formData.username} onChange={handleInputChange} placeholder="Enter your username" className="border-gray-800 text-white rounded-lg focus:border-purple-500 focus:ring-purple-500" style={{ backgroundColor: '#000000' }} disabled={isLoading} required/>
            </div>

            {isSignUp && (<div className="space-y-2">
                <label_1.Label htmlFor="email">Email (Optional)</label_1.Label>
                <input_1.Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" className="border-gray-800 text-white rounded-lg focus:border-purple-500 focus:ring-purple-500" style={{ backgroundColor: '#000000' }} disabled={isLoading}/>
              </div>)}

            <div className="space-y-2">
              <label_1.Label htmlFor="password">Password</label_1.Label>
              <div className="relative">
                <input_1.Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="Enter your password" className="border-gray-800 text-white rounded-lg pr-10 focus:border-purple-500 focus:ring-purple-500" style={{ backgroundColor: '#000000' }} disabled={isLoading} required/>
                <button_1.Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white" onClick={function () { return setShowPassword(!showPassword); }} disabled={isLoading}>
                  {showPassword ? <lucide_react_1.EyeOff className="h-4 w-4"/> : <lucide_react_1.Eye className="h-4 w-4"/>}
                </button_1.Button>
              </div>
            </div>

            <button_1.Button type="submit" className="w-full text-white font-medium rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: '#a855f7' }} disabled={isLoading}>
              {isLoading ? (<div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </div>) : (<div className="flex items-center space-x-2">
                  {isSignUp ? <lucide_react_1.UserPlus className="h-4 w-4"/> : <lucide_react_1.LogIn className="h-4 w-4"/>}
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                </div>)}
            </button_1.Button>
          </form>

          <div className="text-center">
            <button_1.Button variant="ghost" className="hover:opacity-80 transition-opacity" style={{ color: '#a855f7' }} onClick={function () {
            setIsSignUp(!isSignUp);
            setError('');
            setFormData({ username: '', password: '', email: '' });
        }} disabled={isLoading}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button_1.Button>
          </div>

          <div className="text-center text-xs text-gray-500 mt-4">
            <p>Zebulon AI System v1.0</p>
            <p>Local Processing • Secure • Private</p>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
};
exports.default = LoginScreen;
