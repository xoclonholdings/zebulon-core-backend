"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ThreatFeed;
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
function ThreatFeed(_a) {
    var data = _a.data, lastUpdate = _a.lastUpdate, onRefresh = _a.onRefresh;
    var events = data || [];
    var getSeverityColor = function (severity) {
        switch (severity) {
            case "CRITICAL": return "text-red-400 bg-red-400/20";
            case "HIGH": return "text-red-400 bg-red-400/20";
            case "MEDIUM": return "cyber-orange bg-cyber-orange/20";
            case "LOW": return "cyber-green bg-cyber-green/20";
            default: return "text-slate-400 bg-slate-400/20";
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case "BLOCKED": return "cyber-green bg-cyber-green/20";
            case "MONITORED": return "cyber-orange bg-cyber-orange/20";
            case "VERIFIED": return "cyber-green bg-cyber-green/20";
            case "SECURE": return "cyber-blue bg-cyber-blue/20";
            case "HIGH": return "text-red-400 bg-red-400/20";
            default: return "text-slate-400 bg-slate-400/20";
        }
    };
    var formatEventDescription = function (event) {
        switch (event.eventType) {
            case "AI_INJECTION":
                return "AI Injection Attempt Blocked";
            case "CORPORATE_SABOTAGE":
                return "Corporate Interference Detected";
            case "MARKET_MANIPULATION":
                return "Market Manipulation Pattern Detected";
            case "SYSTEM_INTEGRITY":
                return "System Integrity Verification";
            case "COUNTERMEASURE":
                return "AI Countermeasures Deployed";
            default:
                return event.description;
        }
    };
    var formatTime = function (timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    return (<card_1.Card className="bg-navy-800 border-navy-600">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center text-white">
          <lucide_react_1.Activity className="cyber-blue mr-2"/>
          Real-time Threat Feed
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {events.length === 0 ? (<div className="text-center text-slate-400 py-8">
              No security events detected
            </div>) : (events.map(function (event) { return (<div key={event.id} className="flex items-center space-x-3 p-3 bg-navy-700 rounded-lg">
                <div className={"w-2 h-2 rounded-full flex-shrink-0 ".concat(event.severity === "CRITICAL" ? "bg-red-400" :
                event.severity === "HIGH" ? "bg-cyber-orange" :
                    "bg-cyber-green")}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {formatEventDescription(event)}
                  </p>
                  <p className="text-xs text-slate-400">
                    Source: {event.source} • {formatTime(event.timestamp)}
                  </p>
                </div>
                <badge_1.Badge className={"text-xs ".concat(getSeverityColor(event.severity))}>
                  {event.status}
                </badge_1.Badge>
              </div>); }))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Last updated: {lastUpdate ? formatTime(lastUpdate) : "Never"}
          </span>
          <button_1.Button variant="ghost" size="sm" onClick={onRefresh} className="text-cyber-blue hover:text-cyber-blue/80">
            <lucide_react_1.RefreshCw className="w-3 h-3 mr-1"/>
            Refresh
          </button_1.Button>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
