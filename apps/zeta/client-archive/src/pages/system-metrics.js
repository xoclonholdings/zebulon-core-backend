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
exports.default = SystemMetrics;
var react_query_1 = require("@tanstack/react-query");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var wouter_1 = require("wouter");
function SystemMetrics() {
    var _this = this;
    var _a = (0, react_query_1.useQuery)({
        queryKey: ['/api/system-metrics'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/system-metrics', {
                            credentials: 'include'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch system metrics');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
    }), systemMetrics = _a.data, isLoading = _a.isLoading;
    var getMetricColor = function (value) {
        if (value >= 90)
            return 'text-red-400';
        if (value >= 70)
            return 'text-yellow-400';
        return 'text-cyber-green';
    };
    var getMetricIcon = function (type) {
        switch (type === null || type === void 0 ? void 0 : type.toLowerCase()) {
            case 'cpu': return <lucide_react_1.Cpu className="w-5 h-5"/>;
            case 'memory': return <lucide_react_1.HardDrive className="w-5 h-5"/>;
            case 'network': return <lucide_react_1.Wifi className="w-5 h-5"/>;
            default: return <lucide_react_1.Activity className="w-5 h-5"/>;
        }
    };
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
                <lucide_react_1.Activity className="w-6 h-6 mr-2 text-cyber-blue"/>
                System Metrics
              </h1>
              <p className="text-slate-400">Real-time system performance monitoring</p>
            </div>
          </div>
        </div>

        {isLoading ? (<div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading system metrics...</p>
          </div>) : (<div className="grid gap-6">
            {/* Current Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(systemMetrics === null || systemMetrics === void 0 ? void 0 : systemMetrics.map(function (metric, index) { return (<card_1.Card key={index} className="bg-navy-800 border-navy-600">
                  <card_1.CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={"".concat(getMetricColor(metric.value), " flex-shrink-0")}>
                          {getMetricIcon(metric.metricType)}
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm uppercase tracking-wide">
                            {metric.metricType}
                          </p>
                          <p className={"text-2xl font-bold ".concat(getMetricColor(metric.value))}>
                            {metric.value}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <badge_1.Badge className={metric.value >= 90 ? 'bg-red-600' :
                    metric.value >= 70 ? 'bg-yellow-600' : 'bg-green-600'}>
                          {metric.value >= 90 ? 'CRITICAL' :
                    metric.value >= 70 ? 'WARNING' : 'NORMAL'}
                        </badge_1.Badge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-navy-700 rounded-full h-2">
                        <div className={"h-2 rounded-full transition-all duration-300 ".concat(metric.value >= 90 ? 'bg-red-500' :
                    metric.value >= 70 ? 'bg-yellow-500' : 'bg-cyber-green')} style={{ width: "".concat(metric.value, "%") }}></div>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>); })) || (<div className="col-span-4 text-center py-8">
                  <lucide_react_1.Activity className="w-12 h-12 text-slate-400 mx-auto mb-4"/>
                  <p className="text-slate-300">No system metrics available</p>
                  <p className="text-slate-400 text-sm">Monitoring systems may be offline</p>
                </div>)}
            </div>

            {/* Detailed System Information */}
            <card_1.Card className="bg-navy-800 border-navy-600">
              <card_1.CardHeader>
                <card_1.CardTitle className="text-white">System Status Overview</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-white">Performance</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Uptime:</span>
                        <span className="text-cyber-green">99.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Response Time:</span>
                        <span className="text-cyber-green">12ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Throughput:</span>
                        <span className="text-cyber-green">1.2K req/s</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-white">Security</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Threats Blocked:</span>
                        <span className="text-cyber-green">247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Encryption:</span>
                        <span className="text-cyber-green">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Firewall:</span>
                        <span className="text-cyber-green">Enabled</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-white">Network</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bandwidth:</span>
                        <span className="text-cyber-green">850 Mbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Latency:</span>
                        <span className="text-cyber-green">8ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Connections:</span>
                        <span className="text-cyber-green">1,247</span>
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
