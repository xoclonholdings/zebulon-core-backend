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
exports.default = WalletConnect;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var useWallet_1 = require("@/hooks/useWallet");
var useAuth_1 = require("@/hooks/useAuth");
var lucide_react_1 = require("lucide-react");
var wouter_1 = require("wouter");
function WalletConnect() {
    var _this = this;
    var _a = (0, useWallet_1.useWallet)(), account = _a.account, isConnected = _a.isConnected, isConnecting = _a.isConnecting, connectWallet = _a.connectWallet, getAvailableWallets = _a.getAvailableWallets, isWalletAvailable = _a.isWalletAvailable, connectedWalletType = _a.connectedWalletType, walletError = _a.error;
    var _b = (0, useAuth_1.useAuth)(), walletAuthMutation = _b.walletAuthMutation, isAuthenticated = _b.isAuthenticated;
    var _c = (0, wouter_1.useLocation)(), setLocation = _c[1];
    var availableWallets = getAvailableWallets();
    // Auto-authenticate when wallet is connected
    (0, react_1.useEffect)(function () {
        if (account && isConnected && !isAuthenticated) {
            walletAuthMutation.mutate(account);
        }
    }, [account, isConnected, isAuthenticated, walletAuthMutation]);
    // Redirect to dashboard when authenticated
    (0, react_1.useEffect)(function () {
        if (isAuthenticated) {
            setLocation("/");
        }
    }, [isAuthenticated, setLocation]);
    var handleConnect = function (walletType) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectWallet(walletType)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Left Column - Hero Section */}
        <div className="flex flex-col justify-center space-y-6 text-white">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <lucide_react_1.Shield className="h-12 w-12 text-blue-400"/>
              <h1 className="text-4xl font-bold">Fantasma Firewall</h1>
            </div>
            <p className="text-xl text-gray-300">
              Advanced Web3 Security Operations Center
            </p>
            <p className="text-gray-400 max-w-md">
              Protect the ZEBULON Web3 Interface with AI-powered threat detection, 
              quantum-level encryption, and real-time security monitoring.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <lucide_react_1.Zap className="h-6 w-6 text-yellow-400"/>
              <span className="text-gray-300">Zeta Core AI Sentry</span>
            </div>
            <div className="flex items-center space-x-3">
              <lucide_react_1.Lock className="h-6 w-6 text-green-400"/>
              <span className="text-gray-300">4-Layer Quantum Encryption</span>
            </div>
            <div className="flex items-center space-x-3">
              <lucide_react_1.Shield className="h-6 w-6 text-blue-400"/>
              <span className="text-gray-300">ZWAP! Exchange Protection</span>
            </div>
          </div>
        </div>

        {/* Right Column - Wallet Connection */}
        <div className="flex items-center justify-center">
          <card_1.Card className="w-full max-w-md bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <card_1.CardHeader className="text-center">
              <card_1.CardTitle className="text-2xl text-white">Connect Wallet</card_1.CardTitle>
              <card_1.CardDescription className="text-gray-400">
                Connect your Web3 wallet to access the Fantasma Firewall security dashboard
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-6">
              {!isWalletAvailable ? (<div className="text-center space-y-4">
                  <lucide_react_1.AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto"/>
                  <p className="text-gray-300">
                    No Web3 wallet detected
                  </p>
                  <div className="space-y-2">
                    <button_1.Button onClick={function () { return window.open('https://metamask.io/download/', '_blank'); }} className="w-full bg-orange-600 hover:bg-orange-700">
                      Install MetaMask
                    </button_1.Button>
                    <button_1.Button onClick={function () { return window.open('https://www.coinbase.com/wallet/downloads', '_blank'); }} className="w-full bg-blue-600 hover:bg-blue-700" variant="outline">
                      Install Coinbase Wallet
                    </button_1.Button>
                  </div>
                </div>) : isConnected && account ? (<div className="space-y-4">
                  <div className="text-center">
                    <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <lucide_react_1.Shield className="h-6 w-6 text-white"/>
                    </div>
                    <p className="text-green-400 font-medium">Wallet Connected</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {connectedWalletType === "metamask" && "🦊 MetaMask: "}
                      {connectedWalletType === "coinbase" && "🔵 Coinbase: "}
                      {connectedWalletType === "other" && "🔗 Web3 Wallet: "}
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </p>
                  </div>
                  
                  {walletAuthMutation.isPending && (<div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                      <p className="text-gray-400 mt-2">Authenticating...</p>
                    </div>)}
                </div>) : (<div className="space-y-4">
                  {availableWallets.length > 0 ? (<div className="space-y-3">
                      <p className="text-gray-300 text-sm text-center">Choose your wallet:</p>
                      {availableWallets.map(function (wallet) { return (<button_1.Button key={wallet.type} onClick={function () { return handleConnect(wallet.type); }} disabled={isConnecting} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg justify-start" variant="outline">
                          {isConnecting ? (<div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Connecting...</span>
                            </div>) : (<div className="flex items-center space-x-3">
                              <span className="text-xl">{wallet.icon}</span>
                              <span>Connect {wallet.name}</span>
                            </div>)}
                        </button_1.Button>); })}
                      
                      {/* Fallback connect button for any Web3 wallet */}
                      <button_1.Button onClick={function () { return handleConnect(); }} disabled={isConnecting} className="w-full bg-gray-600 hover:bg-gray-700 h-12 text-lg" variant="outline">
                        <div className="flex items-center space-x-2">
                          <lucide_react_1.Wallet className="h-5 w-5"/>
                          <span>Connect Any Web3 Wallet</span>
                        </div>
                      </button_1.Button>
                    </div>) : (<button_1.Button onClick={function () { return handleConnect(); }} disabled={isConnecting} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
                      {isConnecting ? (<div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Connecting...</span>
                        </div>) : (<div className="flex items-center space-x-2">
                          <lucide_react_1.Shield className="h-5 w-5"/>
                          <span>Connect Wallet</span>
                        </div>)}
                    </button_1.Button>)}
                  
                  {walletError && (<div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
                      <p className="text-red-300 text-sm">{walletError}</p>
                    </div>)}
                  
                  <p className="text-xs text-gray-500 text-center">
                    By connecting your wallet, you agree to the ZEBULON Web3 Interface security protocols
                  </p>
                </div>)}
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>
    </div>);
}
