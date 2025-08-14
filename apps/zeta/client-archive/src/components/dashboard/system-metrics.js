"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SystemMetrics;
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
function SystemMetrics(_a) {
    var data = _a.data;
    var defaultMetrics = [
        { id: 1, metricType: "CPU", value: 23, unit: "%" },
        { id: 2, metricType: "MEMORY", value: 67, unit: "%" },
        { id: 3, metricType: "NETWORK", value: 45, unit: "%" },
    ];
    var metrics = data || defaultMetrics;
    var uptime = 99.98;
    var responseTime = 2.1;
    var getMetricColor = function (metricType, value) {
        switch (metricType) {
            case "CPU":
                return value < 50 ? "bg-cyber-green" : value < 80 ? "bg-cyber-orange" : "bg-red-400";
            case "MEMORY":
                return value < 70 ? "bg-cyber-blue" : value < 90 ? "bg-cyber-orange" : "bg-red-400";
            case "NETWORK":
                return value < 60 ? "bg-cyber-orange" : value < 80 ? "bg-cyber-orange" : "bg-red-400";
            default:
                return "bg-cyber-blue";
        }
    };
    var getMetricTextColor = function (metricType, value) {
        switch (metricType) {
            case "CPU":
                return value < 50 ? "cyber-green" : value < 80 ? "cyber-orange" : "text-red-400";
            case "MEMORY":
                return value < 70 ? "cyber-blue" : value < 90 ? "cyber-orange" : "text-red-400";
            case "NETWORK":
                return value < 60 ? "cyber-orange" : value < 80 ? "cyber-orange" : "text-red-400";
            default:
                return "cyber-blue";
        }
    };
    return (<card_1.Card className="bg-navy-800 border-navy-600">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center text-white">
          <lucide_react_1.BarChart3 className="cyber-blue mr-2"/>
          System Metrics
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="space-y-4">
          {metrics.map(function (metric) { return (<div key={metric.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">{metric.metricType} Usage</span>
                <span className={"text-sm font-medium ".concat(getMetricTextColor(metric.metricType, metric.value))}>
                  {metric.value}{metric.unit}
                </span>
              </div>
              <div className="w-full bg-navy-600 rounded-full h-2">
                <div className={"h-2 rounded-full transition-all duration-500 ".concat(getMetricColor(metric.metricType, metric.value))} style={{ width: "".concat(metric.value, "%") }}/>
              </div>
            </div>); })}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="text-center bg-navy-700 rounded p-2">
            <p className="text-lg font-bold cyber-green">{uptime}%</p>
            <p className="text-xs text-slate-400">Uptime</p>
          </div>
          <div className="text-center bg-navy-700 rounded p-2">
            <p className="text-lg font-bold cyber-blue">{responseTime}s</p>
            <p className="text-xs text-slate-400">Response</p>
          </div>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
