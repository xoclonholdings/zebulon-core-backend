"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZetaCoreStatus;
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var zeta_logo_1752971695045_png_1 = require("@assets/zeta-logo_1752971695045.png");
function ZetaCoreStatus(_a) {
    var data = _a.data;
    if (!data) {
        return (<card_1.Card className="bg-navy-800 border-navy-600">
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center text-white">
            <div className="w-48 h-10 bg-navy-600 rounded flex items-center justify-center mr-2">
              <img src={zeta_logo_1752971695045_png_1.default} alt="Zeta Core AI" className="max-w-full max-h-full object-contain filter brightness-150"/>
            </div>
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="text-center text-slate-400">
            Initializing AI Sentry...
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    }
    return (<card_1.Card className="bg-navy-800 border-navy-600">
      <card_1.CardHeader>
        <div className="flex items-center justify-between">
          <card_1.CardTitle className="flex items-center text-white">
            <div className="w-48 h-10 bg-navy-600 rounded flex items-center justify-center mr-2">
              <img src={zeta_logo_1752971695045_png_1.default} alt="Zeta Core AI" className="max-w-full max-h-full object-contain filter brightness-150"/>
            </div>
          </card_1.CardTitle>
          <badge_1.Badge variant={data.isActive ? "default" : "destructive"} className="bg-cyber-green/20 text-cyber-green">
            {data.isActive ? "ACTIVE" : "OFFLINE"}
          </badge_1.Badge>
        </div>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-navy-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">AI Confidence</p>
            <p className="text-2xl font-bold cyber-green">{data.aiConfidence.toFixed(1)}%</p>
          </div>
          <div className="bg-navy-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Threats Blocked</p>
            <p className="text-2xl font-bold cyber-blue">{data.threatsBlocked.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Neural Processing</span>
            <span className="cyber-green">{data.neuralProcessing}%</span>
          </div>
          <div className="w-full bg-navy-600 rounded-full h-2">
            <div className="bg-gradient-to-r from-cyber-green to-cyber-blue h-2 rounded-full transition-all duration-500" style={{ width: "".concat(data.neuralProcessing, "%") }}/>
          </div>
        </div>
        
        <div className="p-3 bg-cyber-purple/10 rounded-lg border border-cyber-purple/30">
          <p className="text-sm cyber-purple">
            <lucide_react_1.Brain className="inline w-4 h-4 mr-2"/>
            Currently analyzing {data.analysisPatterns} suspicious patterns. Corporate sabotage detection algorithms running at optimal performance.
          </p>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
