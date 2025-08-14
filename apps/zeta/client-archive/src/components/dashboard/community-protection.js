"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommunityProtection;
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
function CommunityProtection() {
    var protectedUsers = 12847;
    var communityMetrics = [
        { name: "Credit System Security", status: "Optimal" },
        { name: "Anti-Censorship", status: "Active" },
        { name: "Privacy Protection", status: "Enhanced" },
    ];
    return (<card_1.Card className="bg-navy-800 border-navy-600">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center text-white">
          <lucide_react_1.Users className="cyber-green mr-2"/>
          Community Protection
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold cyber-green">{protectedUsers.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Protected Users</p>
        </div>
        
        <div className="space-y-3">
          {communityMetrics.map(function (metric, index) { return (<div key={index} className="flex justify-between">
              <span className="text-sm text-slate-400">{metric.name}</span>
              <span className="text-sm cyber-green">{metric.status}</span>
            </div>); })}
        </div>
        
        <div className="bg-navy-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-2">Community Governance</p>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyber-green rounded-full"/>
            <span className="text-sm cyber-green">Active Participation</span>
          </div>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
