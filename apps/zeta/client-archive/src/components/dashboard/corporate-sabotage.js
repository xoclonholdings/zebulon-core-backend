"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CorporateSabotage;
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
function CorporateSabotage(_a) {
    var data = _a.data;
    var threatData = data || {
        aiInjection: 0,
        corporateSabotage: 0,
        marketManipulation: 0,
        totalBlocked: 0,
    };
    var patternRecognition = 89; // Simulated value
    return (<card_1.Card className="bg-navy-800 border-navy-600">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center text-white">
          <lucide_react_1.Search className="text-red-400 mr-2"/>
          Corporate Sabotage Detection
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">AI Injection Attempts</span>
            <span className="text-sm font-semibold text-red-400">{threatData.aiInjection} Blocked</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Access Blocking Attempts</span>
            <span className="text-sm font-semibold text-red-400">{threatData.corporateSabotage} Blocked</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Market Manipulation</span>
            <span className="text-sm font-semibold cyber-green">{threatData.marketManipulation} Detected</span>
          </div>
        </div>
        
        <div className="bg-navy-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Pattern Recognition</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-navy-600 rounded-full h-2">
              <div className="bg-gradient-to-r from-red-500 to-cyber-orange h-2 rounded-full transition-all duration-500" style={{ width: "".concat(patternRecognition, "%") }}/>
            </div>
            <span className="text-xs font-semibold cyber-orange">{patternRecognition}%</span>
          </div>
        </div>
        
        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
          <p className="text-xs text-red-400">
            <lucide_react_1.CircleAlert className="inline w-3 h-3 mr-1"/>
            High corporate threat activity detected. Enhanced monitoring enabled.
          </p>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
