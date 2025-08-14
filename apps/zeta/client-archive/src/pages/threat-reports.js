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
exports.default = ThreatReports;
var react_query_1 = require("@tanstack/react-query");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var wouter_1 = require("wouter");
function ThreatReports() {
    var _this = this;
    var _a = (0, react_query_1.useQuery)({
        queryKey: ['/api/security-events'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/security-events?limit=100', {
                            credentials: 'include'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch security events');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
    }), securityEvents = _a.data, isLoading = _a.isLoading;
    var getSeverityColor = function (severity) {
        switch (severity) {
            case 'CRITICAL': return 'bg-red-600';
            case 'HIGH': return 'bg-orange-500';
            case 'MEDIUM': return 'bg-yellow-500';
            case 'LOW': return 'bg-blue-500';
            default: return 'bg-gray-500';
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
                <lucide_react_1.AlertTriangle className="w-6 h-6 mr-2 text-red-400"/>
                Threat Reports
              </h1>
              <p className="text-slate-400">Security event monitoring and analysis</p>
            </div>
          </div>
        </div>

        {isLoading ? (<div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading security events...</p>
          </div>) : (<div className="grid gap-4">
            {securityEvents === null || securityEvents === void 0 ? void 0 : securityEvents.map(function (event, index) {
                var _a;
                return (<card_1.Card key={index} className="bg-navy-800 border-navy-600">
                <card_1.CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <card_1.CardTitle className="flex items-center text-white">
                      <lucide_react_1.Shield className="w-5 h-5 mr-2 text-cyber-blue"/>
                      {((_a = event.eventType) === null || _a === void 0 ? void 0 : _a.replace(/_/g, ' ')) || 'Security Event'}
                    </card_1.CardTitle>
                    <badge_1.Badge className={"".concat(getSeverityColor(event.severity), " text-white")}>
                      {event.severity || 'UNKNOWN'}
                    </badge_1.Badge>
                  </div>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <p className="text-slate-300 mb-2">{event.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Source:</span>
                      <span className="text-white ml-2">{event.source || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Target:</span>
                      <span className="text-white ml-2">{event.target || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Status:</span>
                      <span className="text-white ml-2">{event.status || 'ACTIVE'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Timestamp:</span>
                      <span className="text-white ml-2">
                        {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>);
            })}
            
            {(!securityEvents || securityEvents.length === 0) && (<card_1.Card className="bg-navy-800 border-navy-600">
                <card_1.CardContent className="text-center py-8">
                  <lucide_react_1.Shield className="w-12 h-12 text-slate-400 mx-auto mb-4"/>
                  <p className="text-slate-300">No security events detected</p>
                  <p className="text-slate-400 text-sm">All systems are secure</p>
                </card_1.CardContent>
              </card_1.Card>)}
          </div>)}
      </div>
    </div>);
}
