"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var textarea_1 = require("@/components/ui/textarea");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
var queryClient_1 = require("@/lib/queryClient");
var use_toast_1 = require("@/hooks/use-toast");
var ModuleSettings = function (_a) {
    var _b;
    var moduleName = _a.moduleName, displayName = _a.displayName, onClose = _a.onClose, onSave = _a.onSave;
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _c = (0, react_1.useState)('url'), integrationType = _c[0], setIntegrationType = _c[1];
    var _d = (0, react_1.useState)(''), integrationUrl = _d[0], setIntegrationUrl = _d[1];
    var _e = (0, react_1.useState)(''), integrationScript = _e[0], setIntegrationScript = _e[1];
    var _f = (0, react_1.useState)(''), integrationEmbed = _f[0], setIntegrationEmbed = _f[1];
    var _g = (0, react_1.useState)(''), connectedAppName = _g[0], setConnectedAppName = _g[1];
    // Get existing module integration
    var moduleData = (0, react_query_1.useQuery)({
        queryKey: ['/api/modules', moduleName],
        enabled: !!moduleName,
    }).data;
    (0, react_1.useEffect)(function () {
        if (moduleData) {
            setIntegrationType(moduleData.integrationType || 'url');
            setIntegrationUrl(moduleData.integrationUrl || '');
            setIntegrationScript(moduleData.integrationScript || '');
            setIntegrationEmbed(moduleData.integrationEmbed || '');
            setConnectedAppName(moduleData.connectedAppName || '');
        }
    }, [moduleData]);
    // Save integration mutation
    var saveIntegrationMutation = (0, react_query_1.useMutation)({
        mutationFn: function (integrationData) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!moduleData) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, queryClient_1.apiRequest)("/api/modules/".concat(moduleName), 'PUT', integrationData)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, (0, queryClient_1.apiRequest)('/api/modules', 'POST', __assign({ moduleName: moduleName, displayName: displayName }, integrationData))];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function (savedIntegration) {
            queryClient.invalidateQueries({ queryKey: ['/api/modules'] });
            queryClient.invalidateQueries({ queryKey: ['/api/modules', moduleName] });
            onSave(savedIntegration);
            toast({
                title: "Integration Saved",
                description: "".concat(displayName, " module has been connected successfully"),
            });
        },
        onError: function (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to save integration",
                variant: "destructive",
            });
        },
    });
    var handleSave = function () {
        if (!connectedAppName.trim()) {
            toast({
                title: "Error",
                description: "Please provide an app name for this integration",
                variant: "destructive",
            });
            return;
        }
        var integrationData = {
            isConnected: true,
            integrationType: integrationType,
            connectedAppName: connectedAppName.trim(),
        };
        switch (integrationType) {
            case 'url':
                if (!integrationUrl.trim()) {
                    toast({
                        title: "Error",
                        description: "Please provide a URL for the integration",
                        variant: "destructive",
                    });
                    return;
                }
                integrationData.integrationUrl = integrationUrl.trim();
                break;
            case 'script':
                if (!integrationScript.trim()) {
                    toast({
                        title: "Error",
                        description: "Please provide a script for the integration",
                        variant: "destructive",
                    });
                    return;
                }
                integrationData.integrationScript = integrationScript.trim();
                break;
            case 'embed':
                if (!integrationEmbed.trim()) {
                    toast({
                        title: "Error",
                        description: "Please provide an embed code for the integration",
                        variant: "destructive",
                    });
                    return;
                }
                integrationData.integrationEmbed = integrationEmbed.trim();
                break;
        }
        saveIntegrationMutation.mutate(integrationData);
    };
    var handleDisconnect = function () {
        var disconnectData = {
            isConnected: false,
            integrationType: null,
            integrationUrl: null,
            integrationScript: null,
            integrationEmbed: null,
            connectedAppName: null,
        };
        saveIntegrationMutation.mutate(disconnectData);
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <card_1.Card className="w-full max-w-2xl mx-4 border-gray-800" style={{ backgroundColor: '#000000' }}>
        <card_1.CardHeader className="flex flex-row items-center justify-between">
          <card_1.CardTitle className="text-white">
            {(moduleData === null || moduleData === void 0 ? void 0 : moduleData.isConnected) ? "Edit ".concat(displayName, " Integration") : "Connect ".concat(displayName, " Module")}
          </card_1.CardTitle>
          <button_1.Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <lucide_react_1.X className="h-4 w-4"/>
          </button_1.Button>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-6">
          {(moduleData === null || moduleData === void 0 ? void 0 : moduleData.isConnected) && (<div className="p-4 rounded-lg border border-green-800 bg-green-900 bg-opacity-20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-medium">Currently Connected</p>
                  <p className="text-gray-300 text-sm">{moduleData.connectedAppName}</p>
                  <badge_1.Badge variant="outline" className="text-green-400 border-green-400 mt-2">
                    {(_b = moduleData.integrationType) === null || _b === void 0 ? void 0 : _b.toUpperCase()}
                  </badge_1.Badge>
                </div>
                <button_1.Button variant="outline" onClick={handleDisconnect} className="text-red-400 border-red-400 hover:bg-red-900">
                  Disconnect
                </button_1.Button>
              </div>
            </div>)}

          <div>
            <label_1.Label htmlFor="appName" className="text-white">Connected App Name</label_1.Label>
            <input_1.Input id="appName" value={connectedAppName} onChange={function (e) { return setConnectedAppName(e.target.value); }} placeholder="e.g., My Custom Dashboard" className="border-gray-800 text-white" style={{ backgroundColor: '#000000' }}/>
          </div>

          <div>
            <label_1.Label className="text-white">Integration Type</label_1.Label>
            <select_1.Select value={integrationType} onValueChange={function (value) { return setIntegrationType(value); }}>
              <select_1.SelectTrigger className="border-gray-800 text-white" style={{ backgroundColor: '#000000' }}>
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent style={{ backgroundColor: '#000000' }} className="border-gray-800">
                <select_1.SelectItem value="url" className="text-white hover:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <lucide_react_1.Link className="h-4 w-4"/>
                    <span>URL/Website</span>
                  </div>
                </select_1.SelectItem>
                <select_1.SelectItem value="script" className="text-white hover:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <lucide_react_1.Code className="h-4 w-4"/>
                    <span>Custom Script</span>
                  </div>
                </select_1.SelectItem>
                <select_1.SelectItem value="embed" className="text-white hover:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <lucide_react_1.FileText className="h-4 w-4"/>
                    <span>Embed Code</span>
                  </div>
                </select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          {integrationType === 'url' && (<div>
              <label_1.Label htmlFor="integrationUrl" className="text-white">Website URL</label_1.Label>
              <input_1.Input id="integrationUrl" type="url" value={integrationUrl} onChange={function (e) { return setIntegrationUrl(e.target.value); }} placeholder="https://example.com" className="border-gray-800 text-white" style={{ backgroundColor: '#000000' }}/>
              <p className="text-gray-400 text-sm mt-1">
                Enter the URL of the website or web app you want to integrate
              </p>
            </div>)}

          {integrationType === 'script' && (<div>
              <label_1.Label htmlFor="integrationScript" className="text-white">Custom Script</label_1.Label>
              <textarea_1.Textarea id="integrationScript" value={integrationScript} onChange={function (e) { return setIntegrationScript(e.target.value); }} placeholder="// Enter your custom JavaScript code here" className="border-gray-800 text-white font-mono" style={{ backgroundColor: '#000000' }} rows={8}/>
              <p className="text-gray-400 text-sm mt-1">
                Enter custom JavaScript code to execute when this module is opened
              </p>
            </div>)}

          {integrationType === 'embed' && (<div>
              <label_1.Label htmlFor="integrationEmbed" className="text-white">Embed Code</label_1.Label>
              <textarea_1.Textarea id="integrationEmbed" value={integrationEmbed} onChange={function (e) { return setIntegrationEmbed(e.target.value); }} placeholder="<iframe src='...' width='100%' height='600'></iframe>" className="border-gray-800 text-white font-mono" style={{ backgroundColor: '#000000' }} rows={6}/>
              <p className="text-gray-400 text-sm mt-1">
                Enter HTML embed code (iframe, script tags, etc.)
              </p>
            </div>)}

          <div className="flex justify-end space-x-3 pt-4">
            <button_1.Button variant="outline" onClick={onClose} className="text-gray-400 border-gray-600 hover:text-white">
              Cancel
            </button_1.Button>
            <button_1.Button onClick={handleSave} disabled={saveIntegrationMutation.isPending} className="text-white" style={{ backgroundColor: '#3b82f6' }}>
              <lucide_react_1.Save className="h-4 w-4 mr-2"/>
              {saveIntegrationMutation.isPending ? 'Saving...' : 'Save Integration'}
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
};
exports.default = ModuleSettings;
