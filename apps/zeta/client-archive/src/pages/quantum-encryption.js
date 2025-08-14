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
exports.default = QuantumEncryption;
var react_query_1 = require("@tanstack/react-query");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var wouter_1 = require("wouter");
function QuantumEncryption() {
    var _this = this;
    var _a = (0, react_query_1.useQuery)({
        queryKey: ['/api/quantum-protocols'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/quantum-protocols', {
                            credentials: 'include'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch quantum protocols');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
    }), quantumProtocols = _a.data, isLoading = _a.isLoading;
    var encryptionLayers = (0, react_query_1.useQuery)({
        queryKey: ['/api/encryption-layers'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/dashboard/status', {
                            credentials: 'include'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch encryption status');
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data.encryptionLayers || []];
                }
            });
        }); },
    }).data;
    return (<div className="min-h-screen bg-navy-900 text-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <wouter_1.Link href="/dashboard">
              <button_1.Button variant="ghost" size="sm">
                <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
                Back to Dashboard
              </button_1.Button>
            </wouter_1.Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <lucide_react_1.Lock className="w-6 h-6 mr-2 text-cyber-blue"/>
                Quantum Encryption
              </h1>
              <p className="text-slate-400">Multi-layer quantum security protocols</p>
            </div>
          </div>
        </div>

        {isLoading ? (<div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading quantum protocols...</p>
          </div>) : (<div className="grid gap-6">
            {/* Encryption Layers Status */}
            <card_1.Card className="bg-navy-800 border-navy-600">
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center text-white">
                  <lucide_react_1.Shield className="w-5 h-5 mr-2 text-cyber-green"/>
                  Encryption Layers Status
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(encryptionLayers === null || encryptionLayers === void 0 ? void 0 : encryptionLayers.map(function (layer, index) { return (<div key={index} className="bg-navy-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{layer.layerName}</h3>
                        <badge_1.Badge className={layer.isActive ? 'bg-cyber-green' : 'bg-red-500'}>
                          {layer.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </badge_1.Badge>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{layer.encryptionType}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Strength:</span>
                        <span className="text-cyber-blue">{layer.keyStrength}-bit</span>
                      </div>
                    </div>); })) || (<div className="col-span-3 text-center py-4">
                      <p className="text-slate-400">No encryption layers configured</p>
                    </div>)}
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* Quantum Protocols */}
            <card_1.Card className="bg-navy-800 border-navy-600">
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center text-white">
                  <lucide_react_1.Zap className="w-5 h-5 mr-2 text-yellow-400"/>
                  Active Quantum Protocols
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-4">
                  {(quantumProtocols === null || quantumProtocols === void 0 ? void 0 : quantumProtocols.map(function (protocol, index) {
                var _a;
                return (<div key={index} className="bg-navy-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">
                          {((_a = protocol.protocolType) === null || _a === void 0 ? void 0 : _a.replace(/_/g, ' ')) || 'Quantum Protocol'}
                        </h3>
                        <badge_1.Badge className={protocol.isActive ? 'bg-cyber-green' : 'bg-red-500'}>
                          {protocol.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </badge_1.Badge>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{protocol.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Target:</span>
                          <span className="text-white ml-2">{protocol.targetEntity || 'Global'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Strength:</span>
                          <span className="text-cyber-blue ml-2">{protocol.strength || 'Maximum'}</span>
                        </div>
                      </div>
                    </div>);
            })) || (<div className="text-center py-8">
                      <lucide_react_1.Lock className="w-12 h-12 text-slate-400 mx-auto mb-4"/>
                      <p className="text-slate-300">No quantum protocols detected</p>
                      <p className="text-slate-400 text-sm">System using standard encryption</p>
                    </div>)}
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>)}
      </div>
    </div>);
}
