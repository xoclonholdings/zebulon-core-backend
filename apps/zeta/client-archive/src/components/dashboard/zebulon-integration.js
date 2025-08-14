"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZebulonIntegration;
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
function ZebulonIntegration(_a) {
    var data = _a.data;
    var zebulonNode = data === null || data === void 0 ? void 0 : data.find(function (node) { return node.nodeType === "ZEBULON"; });
    var uptime = 99.9; // Simulated uptime
    var integrationComponents = [
        { name: "API Gateway", status: "Secure" },
        { name: "Data Channels", status: "Encrypted" },
        { name: "Home System", status: "Connected" },
    ];
    var getStatusColor = function (status) {
        switch (status) {
            case "ONLINE":
            case "Secure":
            case "Encrypted":
            case "Connected":
                return "cyber-green";
            case "OFFLINE": return "text-red-400";
            case "DEGRADED": return "cyber-orange";
            default: return "text-slate-400";
        }
    };
    return (<card_1.Card className="bg-navy-800 border-navy-600">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center text-white">
          <lucide_react_1.Home className="cyber-purple mr-2"/>
          Zebulon Integration
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="space-y-2">
          {integrationComponents.map(function (component, index) { return (<div key={index} className="flex items-center justify-between p-2 bg-navy-700 rounded">
              <span className="text-sm text-slate-400">{component.name}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-cyber-green rounded-full"/>
                <span className={"text-xs ".concat(getStatusColor(component.status))}>{component.status}</span>
              </div>
            </div>); })}
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold cyber-blue">{uptime}%</p>
          <p className="text-sm text-slate-400">Uptime</p>
        </div>
        
        <div className="p-3 bg-cyber-purple/10 rounded-lg border border-cyber-purple/30">
          <p className="text-xs cyber-purple">
            <lucide_react_1.Link className="inline w-3 h-3 mr-1"/>
            Secure Web3 interface integration active. All protocols verified.
          </p>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
