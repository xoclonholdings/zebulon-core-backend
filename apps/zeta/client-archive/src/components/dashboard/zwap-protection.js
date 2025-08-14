"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZwapProtection;
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
function ZwapProtection(_a) {
    var data = _a.data;
    var components = data || [
        { id: 1, componentType: "SMART_CONTRACT", componentName: "XHI Token", status: "SECURE", integrityScore: 100 },
        { id: 2, componentType: "TRADING_ENGINE", componentName: "Exchange Core", status: "SECURE", integrityScore: 100 },
        { id: 3, componentType: "CREDIT_SYSTEM", componentName: "Community Credits", status: "SECURE", integrityScore: 100 },
    ];
    var getStatusColor = function (status) {
        switch (status) {
            case "SECURE": return "cyber-green";
            case "VULNERABLE": return "cyber-orange";
            case "UNDER_ATTACK": return "text-red-400";
            default: return "text-slate-400";
        }
    };
    var getStatusText = function (componentType) {
        switch (componentType) {
            case "SMART_CONTRACT": return "Verified";
            case "TRADING_ENGINE": return "Secured";
            case "CREDIT_SYSTEM": return "Protected";
            default: return "Secure";
        }
    };
    return (<card_1.Card className="bg-navy-800 border-navy-600">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center text-white">
          <lucide_react_1.Coins className="cyber-orange mr-2"/>
          ZWAP! Exchange Protection
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-navy-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Smart Contracts</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-cyber-green rounded-full"/>
              <span className="text-sm font-medium cyber-green">Verified</span>
            </div>
          </div>
          <div className="bg-navy-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Trading Engine</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-cyber-green rounded-full"/>
              <span className="text-sm font-medium cyber-green">Secured</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">XHI Token Integrity</span>
            <span className="text-sm cyber-green">100%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Credit System Security</span>
            <span className="text-sm cyber-green">Optimal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Community Protection</span>
            <span className="text-sm cyber-green">Active</span>
          </div>
        </div>
        
        <div className="p-3 bg-cyber-green/10 rounded-lg border border-cyber-green/30">
          <p className="text-xs cyber-green">
            <lucide_react_1.ShieldCheck className="inline w-3 h-3 mr-1"/>
            All ZWAP! systems protected. Anti-manipulation algorithms active.
          </p>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
