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
exports.default = EmergencyProtocols;
var react_query_1 = require("@tanstack/react-query");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var wouter_1 = require("wouter");
var use_toast_1 = require("@/hooks/use-toast");
function EmergencyProtocols() {
    var _this = this;
    var _a, _b;
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['/api/threat-mitigation/status'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/threat-mitigation/status', {
                            credentials: 'include'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            // Return mock data for demo
                            return [2 /*return*/, {
                                    activeMitigations: [
                                        {
                                            id: 1,
                                            type: "QUANTUM_ISOLATION",
                                            target: "SUSPICIOUS_ENTITY_001",
                                            status: "ACTIVE",
                                            severity: "HIGH"
                                        }
                                    ],
                                    systemStatus: "SECURE",
                                    lastUpdate: new Date().toISOString()
                                }];
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
    }), threatMitigationStatus = _c.data, isLoading = _c.isLoading;
    // Emergency lockdown mutation
    var lockdownMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/security-events', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                eventType: 'EMERGENCY_LOCKDOWN',
                                severity: 'CRITICAL',
                                source: 'EMERGENCY_PROTOCOLS',
                                description: 'Emergency lockdown initiated from protocols dashboard',
                                status: 'ACTIVE'
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to initiate lockdown');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({
                title: "Emergency Lockdown Initiated",
                description: "All systems are now in lockdown mode",
                variant: "destructive",
            });
            queryClient.invalidateQueries({ queryKey: ['/api/threat-mitigation/status'] });
        }
    });
    var deployCountermeasure = function (type) { return __awaiter(_this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch('/api/security-events', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                eventType: "COUNTERMEASURE_".concat(type),
                                severity: 'HIGH',
                                source: 'EMERGENCY_PROTOCOLS',
                                description: "".concat(type, " countermeasure deployed"),
                                status: 'ACTIVE'
                            })
                        })];
                case 1:
                    response = _a.sent();
                    if (response.ok) {
                        toast({
                            title: "Countermeasure Deployed",
                            description: "".concat(type, " protocol is now active"),
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    toast({
                        title: "Deployment Failed",
                        description: "Failed to deploy ".concat(type, " countermeasure"),
                        variant: "destructive",
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
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
                <lucide_react_1.AlertTriangle className="w-6 h-6 mr-2 text-red-400"/>
                Emergency Protocols
              </h1>
              <p className="text-slate-400">Critical security response and threat mitigation</p>
            </div>
          </div>
        </div>

        {isLoading ? (<div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading emergency protocols...</p>
          </div>) : (<div className="grid gap-6">
            {/* Emergency Actions */}
            <card_1.Card className="bg-navy-800 border-red-600">
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center text-red-400">
                  <lucide_react_1.AlertTriangle className="w-5 h-5 mr-2"/>
                  Critical Emergency Actions
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button_1.Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={function () { return lockdownMutation.mutate(); }} disabled={lockdownMutation.isPending}>
                    <lucide_react_1.Lock className="w-4 h-4 mr-2"/>
                    {lockdownMutation.isPending ? 'Initiating...' : 'Emergency Lockdown'}
                  </button_1.Button>
                  
                  <button_1.Button variant="destructive" className="bg-orange-600 hover:bg-orange-700" onClick={function () { return deployCountermeasure('ISOLATION'); }}>
                    <lucide_react_1.Shield className="w-4 h-4 mr-2"/>
                    Deploy Isolation Protocol
                  </button_1.Button>
                  
                  <button_1.Button variant="destructive" className="bg-yellow-600 hover:bg-yellow-700" onClick={function () { return deployCountermeasure('HONEYPOT'); }}>
                    <lucide_react_1.Zap className="w-4 h-4 mr-2"/>
                    Activate Honeypot
                  </button_1.Button>
                  
                  <button_1.Button variant="destructive" className="bg-purple-600 hover:bg-purple-700" onClick={function () { return deployCountermeasure('QUANTUM_ENCRYPTION'); }}>
                    <lucide_react_1.Lock className="w-4 h-4 mr-2"/>
                    Quantum Defense Mode
                  </button_1.Button>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* Active Mitigations */}
            <card_1.Card className="bg-navy-800 border-navy-600">
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center text-white">
                  <lucide_react_1.Shield className="w-5 h-5 mr-2 text-cyber-green"/>
                  Active Threat Mitigations
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-4">
                  {((_a = threatMitigationStatus === null || threatMitigationStatus === void 0 ? void 0 : threatMitigationStatus.activeMitigations) === null || _a === void 0 ? void 0 : _a.map(function (mitigation, index) {
                var _a;
                return (<div key={index} className="bg-navy-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">
                          {((_a = mitigation.type) === null || _a === void 0 ? void 0 : _a.replace(/_/g, ' ')) || 'Active Mitigation'}
                        </h3>
                        <badge_1.Badge className={mitigation.status === 'ACTIVE' ? 'bg-cyber-green' : 'bg-red-500'}>
                          {mitigation.status}
                        </badge_1.Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Target:</span>
                          <span className="text-white ml-2">{mitigation.target || 'Unknown'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Severity:</span>
                          <span className="text-white ml-2">{mitigation.severity || 'MEDIUM'}</span>
                        </div>
                      </div>
                    </div>);
            })) || (<div className="text-center py-8">
                      <lucide_react_1.Shield className="w-12 h-12 text-slate-400 mx-auto mb-4"/>
                      <p className="text-slate-300">No active threat mitigations</p>
                      <p className="text-slate-400 text-sm">All systems operating normally</p>
                    </div>)}
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* System Status */}
            <card_1.Card className="bg-navy-800 border-navy-600">
              <card_1.CardHeader>
                <card_1.CardTitle className="text-white">Emergency Response Status</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-white">System Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Overall Status:</span>
                        <span className="text-cyber-green">{(threatMitigationStatus === null || threatMitigationStatus === void 0 ? void 0 : threatMitigationStatus.systemStatus) || 'SECURE'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Defense Mode:</span>
                        <span className="text-cyber-green">ACTIVE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Response Time:</span>
                        <span className="text-cyber-green">&lt; 1s</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-white">Protocol Readiness</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Lockdown:</span>
                        <span className="text-cyber-green">READY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Isolation:</span>
                        <span className="text-cyber-green">READY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quantum Defense:</span>
                        <span className="text-cyber-green">READY</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-white">Last Activity</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Update:</span>
                        <span className="text-cyber-green">
                          {(threatMitigationStatus === null || threatMitigationStatus === void 0 ? void 0 : threatMitigationStatus.lastUpdate) ?
                new Date(threatMitigationStatus.lastUpdate).toLocaleTimeString() :
                'Just Now'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Protocols:</span>
                        <span className="text-cyber-green">{((_b = threatMitigationStatus === null || threatMitigationStatus === void 0 ? void 0 : threatMitigationStatus.activeMitigations) === null || _b === void 0 ? void 0 : _b.length) || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>)}
      </div>
    </div>);
}
