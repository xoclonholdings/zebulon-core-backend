"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AlertSystem;
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
function AlertSystem(_a) {
    var data = _a.data;
    var events = data || [];
    var recentAlerts = events.slice(0, 3);
    var getSeverityColor = function (severity) {
        switch (severity) {
            case "CRITICAL": return "text-red-400 bg-red-500/10 border-red-500/30";
            case "HIGH": return "cyber-orange bg-cyber-orange/10 border-cyber-orange/30";
            case "MEDIUM": return "cyber-blue bg-cyber-blue/10 border-cyber-blue/30";
            default: return "text-slate-400 bg-slate-400/10 border-slate-400/30";
        }
    };
    var formatTime = function (timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    var getAlertMessage = function (event) {
        switch (event.eventType) {
            case "CORPORATE_SABOTAGE":
                return "Corporate interference attempt detected on ZWAP! smart contracts";
            case "MARKET_MANIPULATION":
                return "Unusual trading pattern identified - monitoring enhanced";
            case "SYSTEM_INTEGRITY":
                return "System integrity verification completed successfully";
            default:
                return event.description;
        }
    };
    return (<card_1.Card className="bg-navy-800 border-navy-600">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center text-white">
          <lucide_react_1.Bell className="cyber-orange mr-2"/>
          Alert System
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="space-y-3">
          {recentAlerts.length === 0 ? (<div className="text-center text-slate-400 py-4">
              No recent alerts
            </div>) : (recentAlerts.map(function (alert) { return (<div key={alert.id} className={"p-3 rounded-lg border ".concat(getSeverityColor(alert.severity))}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{alert.severity.charAt(0) + alert.severity.slice(1).toLowerCase()}</span>
                  <span className="text-xs">{formatTime(alert.timestamp)}</span>
                </div>
                <p className="text-xs">{getAlertMessage(alert)}</p>
              </div>); }))}
        </div>
        
        <button_1.Button variant="outline" className="w-full bg-navy-700 hover:bg-navy-600 text-white border-navy-600">
          View All Alerts
        </button_1.Button>
      </card_1.CardContent>
    </card_1.Card>);
}
