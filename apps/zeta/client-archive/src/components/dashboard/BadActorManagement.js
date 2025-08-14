"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadActorManagement = BadActorManagement;
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
function BadActorManagement(_a) {
    var _b = _a.badActors, badActors = _b === void 0 ? [] : _b, _c = _a.quantumProtocols, quantumProtocols = _c === void 0 ? [] : _c, _d = _a.dataDeprecations, dataDeprecations = _d === void 0 ? [] : _d, threatMitigationStatus = _a.threatMitigationStatus;
    var getThreatLevelColor = function (level) {
        if (level >= 9)
            return "bg-red-500";
        if (level >= 7)
            return "bg-orange-500";
        if (level >= 5)
            return "bg-yellow-500";
        if (level >= 3)
            return "bg-blue-500";
        return "bg-green-500";
    };
    var getThreatLevelBadge = function (level) {
        if (level >= 9)
            return "destructive";
        if (level >= 7)
            return "secondary";
        if (level >= 5)
            return "outline";
        return "default";
    };
    var getProtocolIcon = function (type) {
        switch (type) {
            case "HONEYPOT": return <lucide_react_1.Eye className="w-4 h-4"/>;
            case "DATA_POISON": return <lucide_react_1.Database className="w-4 h-4"/>;
            case "MIRROR_TRAP": return <lucide_react_1.Target className="w-4 h-4"/>;
            case "QUANTUM_ISOLATION": return <lucide_react_1.Lock className="w-4 h-4"/>;
            default: return <lucide_react_1.Shield className="w-4 h-4"/>;
        }
    };
    var formatTimestamp = function (timestamp) {
        return new Date(timestamp).toLocaleString();
    };
    return (<div className="space-y-6">
      {/* Threat Mitigation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Bad Actors</p>
                <p className="text-2xl font-bold text-red-400">
                  {(threatMitigationStatus === null || threatMitigationStatus === void 0 ? void 0 : threatMitigationStatus.totalBadActors) || 0}
                </p>
              </div>
              <lucide_react_1.UserX className="w-8 h-8 text-red-400"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Critical Threats</p>
                <p className="text-2xl font-bold text-orange-400">
                  {(threatMitigationStatus === null || threatMitigationStatus === void 0 ? void 0 : threatMitigationStatus.criticalThreats) || 0}
                </p>
              </div>
              <lucide_react_1.AlertTriangle className="w-8 h-8 text-orange-400"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Protocols</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {(threatMitigationStatus === null || threatMitigationStatus === void 0 ? void 0 : threatMitigationStatus.activeProtocols) || 0}
                </p>
              </div>
              <lucide_react_1.Zap className="w-8 h-8 text-cyan-400"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Data Deprecations</p>
                <p className="text-2xl font-bold text-purple-400">
                  {(threatMitigationStatus === null || threatMitigationStatus === void 0 ? void 0 : threatMitigationStatus.activeDeprecations) || 0}
                </p>
              </div>
              <lucide_react_1.Database className="w-8 h-8 text-purple-400"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Effectiveness</p>
                <p className="text-2xl font-bold text-green-400">
                  {(threatMitigationStatus === null || threatMitigationStatus === void 0 ? void 0 : threatMitigationStatus.averageEffectiveness) || 0}%
                </p>
              </div>
              <lucide_react_1.Activity className="w-8 h-8 text-green-400"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">High Threat</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {(threatMitigationStatus === null || threatMitigationStatus === void 0 ? void 0 : threatMitigationStatus.highThreatActors) || 0}
                </p>
              </div>
              <lucide_react_1.Shield className="w-8 h-8 text-yellow-400"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bad Actors List */}
        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-white flex items-center space-x-2">
              <lucide_react_1.UserX className="w-5 h-5 text-red-400"/>
              <span>Active Bad Actors</span>
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {badActors.slice(0, 10).map(function (actor) { return (<div key={actor.id} className="flex items-center justify-between p-3 bg-navy-700 rounded-lg border border-navy-600">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <badge_1.Badge variant={getThreatLevelBadge(actor.threatLevel)} className="text-xs">
                        Level {actor.threatLevel}
                      </badge_1.Badge>
                      <badge_1.Badge variant="outline" className="text-xs">
                        {actor.identifierType}
                      </badge_1.Badge>
                    </div>
                    <p className="text-sm text-white font-mono">
                      {actor.identifier.length > 30
                ? "".concat(actor.identifier.substring(0, 30), "...")
                : actor.identifier}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-slate-400">
                        {actor.attempts} attempts
                      </span>
                      <span className="text-xs text-slate-400">
                        {actor.countermeasures.length} countermeasures
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <div className={(0, utils_1.cn)("w-3 h-3 rounded-full", getThreatLevelColor(actor.threatLevel))}/>
                    <span className="text-xs text-slate-400">
                      {formatTimestamp(actor.lastActivity).split(' ')[1]}
                    </span>
                  </div>
                </div>); })}
              {badActors.length === 0 && (<div className="text-center py-8 text-slate-400">
                  <lucide_react_1.UserX className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                  <p>No bad actors detected</p>
                </div>)}
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Quantum Protocols */}
        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-white flex items-center space-x-2">
              <lucide_react_1.Zap className="w-5 h-5 text-cyan-400"/>
              <span>Quantum Defense Protocols</span>
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {quantumProtocols.slice(0, 10).map(function (protocol) { return (<div key={protocol.id} className="p-3 bg-navy-700 rounded-lg border border-navy-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getProtocolIcon(protocol.protocolType)}
                      <span className="text-sm font-medium text-white">
                        {protocol.protocolName}
                      </span>
                    </div>
                    <badge_1.Badge variant={protocol.isActive ? "default" : "secondary"} className="text-xs">
                      {protocol.isActive ? "ACTIVE" : "INACTIVE"}
                    </badge_1.Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">
                        {protocol.protocolType}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">
                        {protocol.targetType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <progress_1.Progress value={protocol.effectiveness} className="w-16 h-2"/>
                      <span className="text-xs text-green-400">
                        {protocol.effectiveness}%
                      </span>
                    </div>
                  </div>
                </div>); })}
              {quantumProtocols.length === 0 && (<div className="text-center py-8 text-slate-400">
                  <lucide_react_1.Zap className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                  <p>No protocols deployed</p>
                </div>)}
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Data Deprecations */}
      <card_1.Card className="bg-navy-800 border-navy-600">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-white flex items-center space-x-2">
            <lucide_react_1.Database className="w-5 h-5 text-purple-400"/>
            <span>Active Data Deprecations</span>
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataDeprecations.slice(0, 9).map(function (deprecation) { return (<div key={deprecation.id} className="p-3 bg-navy-700 rounded-lg border border-navy-600">
                <div className="flex items-center justify-between mb-2">
                  <badge_1.Badge variant="outline" className="text-xs">
                    {deprecation.dataType}
                  </badge_1.Badge>
                  <badge_1.Badge variant={deprecation.status === "ACTIVE" ? "default" : "secondary"} className="text-xs">
                    {deprecation.status}
                  </badge_1.Badge>
                </div>
                <p className="text-sm text-white mb-1">
                  {deprecation.deprecationReason}
                </p>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <lucide_react_1.Clock className="w-3 h-3"/>
                  <span>
                    Expires: {formatTimestamp(deprecation.expiresAt).split(' ')[0]}
                  </span>
                </div>
              </div>); })}
            {dataDeprecations.length === 0 && (<div className="col-span-full text-center py-8 text-slate-400">
                <lucide_react_1.Database className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                <p>No active data deprecations</p>
              </div>)}
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
