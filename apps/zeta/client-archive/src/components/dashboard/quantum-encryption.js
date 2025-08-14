"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QuantumEncryption;
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
function QuantumEncryption(_a) {
    var _b;
    var data = _a.data;
    var layers = data || [
        { id: 1, layerName: "Physical", layerNumber: 1, status: "SECURE", encryptionStrength: 2048 },
        { id: 2, layerName: "Network", layerNumber: 2, status: "SECURE", encryptionStrength: 2048 },
        { id: 3, layerName: "Transport", layerNumber: 3, status: "SECURE", encryptionStrength: 2048 },
        { id: 4, layerName: "Application", layerNumber: 4, status: "SECURE", encryptionStrength: 2048 },
    ];
    var getStatusColor = function (status) {
        switch (status) {
            case "SECURE": return "cyber-green";
            case "UPDATING": return "cyber-orange";
            case "COMPROMISED": return "text-red-400";
            default: return "text-slate-400";
        }
    };
    return (<card_1.Card className="bg-navy-800 border-navy-600">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center text-white">
          <lucide_react_1.Atom className="cyber-blue mr-2"/>
          Quantum Encryption
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="space-y-3">
          {layers.map(function (layer) { return (<div key={layer.id} className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Layer {layer.layerNumber} - {layer.layerName}</span>
              <div className="flex items-center space-x-2">
                <div className={"w-2 h-2 rounded-full ".concat(layer.status === "SECURE" ? "bg-cyber-green" : "bg-red-400")}/>
                <span className={"text-xs ".concat(getStatusColor(layer.status))}>
                  {layer.status === "SECURE" ? "Secure" : layer.status}
                </span>
              </div>
            </div>); })}
        </div>
        
        <div className="p-3 bg-cyber-blue/10 rounded-lg">
          <p className="text-xs cyber-blue">
            <lucide_react_1.Key className="inline w-3 h-3 mr-1"/>
            Quantum key distribution active. {((_b = layers[0]) === null || _b === void 0 ? void 0 : _b.encryptionStrength) || 2048}-bit entanglement verified.
          </p>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
