"use strict";
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
exports.default = Dashboard;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var wouter_1 = require("wouter");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var collapsible_1 = require("@/components/ui/collapsible");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var lucide_react_1 = require("lucide-react");
var use_toast_1 = require("@/hooks/use-toast");
var memory_ui_1 = require("@zebulon/memory-ui");
var fantasma_firewall_logo_svg_1 = require("@assets/fantasma-firewall-logo.svg");
var zeta_logo_svg_1 = require("@assets/zeta-logo.svg");
// Mobile-optimized collapsible section component
function CollapsibleSection(_a) {
    var title = _a.title, Icon = _a.icon, children = _a.children, _b = _a.defaultOpen, defaultOpen = _b === void 0 ? false : _b, badge = _a.badge;
    var _c = (0, react_1.useState)(defaultOpen), isOpen = _c[0], setIsOpen = _c[1];
    return (<collapsible_1.Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <collapsible_1.CollapsibleTrigger asChild>
        <card_1.Card className="bg-navy-800 border-navy-600 cursor-pointer hover:bg-navy-750 transition-colors mb-2">
          <card_1.CardHeader className="pb-3 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 cyber-green"/>
                <card_1.CardTitle className="text-base font-medium text-white">{title}</card_1.CardTitle>
                {badge && (<badge_1.Badge variant="secondary" className="bg-cyber-green/20 text-cyber-green text-xs">
                    {badge}
                  </badge_1.Badge>)}
              </div>
              {isOpen ?
            <lucide_react_1.ChevronUp className="w-5 h-5 text-slate-400"/> :
            <lucide_react_1.ChevronDown className="w-5 h-5 text-slate-400"/>}
            </div>
          </card_1.CardHeader>
        </card_1.Card>
      </collapsible_1.CollapsibleTrigger>
      <collapsible_1.CollapsibleContent className="pb-4">
        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardContent className="pt-4">
            {children}
          </card_1.CardContent>
        </card_1.Card>
      </collapsible_1.CollapsibleContent>
    </collapsible_1.Collapsible>);
}
function Dashboard() {
    var _this = this;
    var _a, _b, _c, _d, _e, _f;
    var _g = (0, react_1.useState)(false), mobileMenuOpen = _g[0], setMobileMenuOpen = _g[1];
    var _h = (0, react_1.useState)(false), integrationsOpen = _h[0], setIntegrationsOpen = _h[1];
    var _j = (0, react_1.useState)(false), securityControlsOpen = _j[0], setSecurityControlsOpen = _j[1];
    var _k = (0, wouter_1.useLocation)(), setLocation = _k[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch real dashboard data - skip authentication for demo purposes
    var _l = (0, react_query_1.useQuery)({
        queryKey: ['/api/dashboard/status'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/dashboard/status', {
                            credentials: 'include'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("API Error: ".concat(response.status));
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        refetchInterval: 5000, // Refresh every 5 seconds
    }), dashboardData = _l.data, isLoading = _l.isLoading, error = _l.error;
    // Refresh mutation
    var refreshMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/dashboard/status')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to refresh');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/status'] });
            toast({
                title: "System Refreshed",
                description: "All systems have been refreshed successfully",
            });
        },
        onError: function () {
            toast({
                title: "Refresh Failed",
                description: "Failed to refresh system data",
                variant: "destructive",
            });
        }
    });
    // Emergency lockdown mutation
    var lockdownMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/security-events', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                eventType: 'EMERGENCY_LOCKDOWN',
                                severity: 'CRITICAL',
                                source: 'SYSTEM_ADMIN',
                                description: 'Emergency lockdown initiated from dashboard',
                                status: 'ACTIVE'
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to initiate lockdown');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({
                title: "Emergency Lockdown Initiated",
                description: "All systems are now in lockdown mode",
                variant: "destructive",
            });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/status'] });
        }
    });
    var isConnected = !isLoading && !error;
    var securityData = dashboardData || {
        zetaCore: { aiConfidence: 95, neuralProcessing: 87, isActive: true, analysisPatterns: 42, threatsBlocked: 247 },
        threatCounters: { aiInjection: 15, corporateSabotage: 8, marketManipulation: 3, totalBlocked: 247 },
        securityEvents: [{ eventType: "CORPORATE_INFILTRATION", severity: "HIGH", description: "Blocked ZWAP access attempt" }],
        systemMetrics: [{ metricType: "CPU", value: 31 }, { metricType: "MEMORY", value: 70 }]
    };
    var refreshData = function () { return refreshMutation.mutate(); };
    // Integration handlers - all arms of ZEBULON Web3 Interface
    var handleZebulonIntegration = function () {
        toast({
            title: "ZEBULON Web3 Interface",
            description: "See How-To guides for integration setup instructions",
        });
        setLocation('/how-to');
    };
    var handleZwapIntegration = function () {
        toast({
            title: "ZWAP! Exchange",
            description: "See How-To guides for ZWAP integration setup",
        });
        setLocation('/how-to');
    };
    var handleZetaCoreIntegration = function () {
        toast({
            title: "Zeta Core AI",
            description: "See How-To guides for AI integration setup",
        });
        setLocation('/how-to');
    };
    var handleZincIntegration = function () {
        toast({
            title: "Zinc Infrastructure",
            description: "See How-To guides for infrastructure integration",
        });
        setLocation('/how-to');
    };
    // Security control handlers - all configurable via How-To guides
    var handleThreatReports = function () {
        toast({
            title: "Threat Reports",
            description: "See How-To guides for threat detection setup",
        });
        setLocation('/how-to');
    };
    var handleCorporateSabotage = function () {
        toast({
            title: "Corporate Sabotage Detection",
            description: "See How-To guides for sabotage detection setup",
        });
        setLocation('/how-to');
    };
    var handleQuantumEncryption = function () {
        toast({
            title: "Quantum Encryption",
            description: "See How-To guides for quantum encryption setup",
        });
        setLocation('/how-to');
    };
    var handleSystemMetrics = function () {
        toast({
            title: "System Metrics",
            description: "See How-To guides for metrics configuration",
        });
        setLocation('/how-to');
    };
    var handleEmergencyProtocols = function () {
        toast({
            title: "Emergency Protocols",
            description: "See How-To guides for emergency response setup",
        });
        setLocation('/how-to');
    };
    // Quick action handlers with real functionality
    var handleEmergencyLockdown = function () {
        lockdownMutation.mutate();
    };
    var handleSystemDiagnostics = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch('/api/security-events', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                eventType: 'SYSTEM_DIAGNOSTIC',
                                severity: 'LOW',
                                source: 'SYSTEM_ADMIN',
                                description: 'System diagnostic scan initiated from dashboard',
                                status: 'ACTIVE'
                            })
                        })];
                case 1:
                    response = _a.sent();
                    if (response.ok) {
                        toast({
                            title: "System Diagnostics",
                            description: "Diagnostic scan initiated successfully",
                        });
                        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/status'] });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    toast({
                        title: "Diagnostics Failed",
                        description: "Failed to run system diagnostics",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () {
        toast({
            title: "Logout",
            description: "Logging out of Fantasma Firewall...",
        });
        // In a real application, this would clear authentication and redirect
        setTimeout(function () {
            window.location.href = '/auth';
        }, 1000);
    };
    return (<div className="min-h-screen bg-navy-900 text-slate-100">
      {/* Mobile Header */}
      <header className="bg-navy-800 border-b border-navy-600 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <img src={fantasma_firewall_logo_svg_1.default} alt="Fantasma Firewall" className="w-10 h-10"/>
            <div>
              <div className="text-lg font-bold text-white">Fantasma Firewall</div>
              <div className="text-xs text-slate-400">Security Operations Center</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Zebulon Core Button and Panel */}
            {(function () {
            var _a = (0, react_1.useState)(false), open = _a[0], setOpen = _a[1];
            return <>
                <memory_ui_1.ZebulonCoreButton onOpen={function () { return setOpen(true); }}/>
                {open && <memory_ui_1.ZebulonCorePanel appName="Zeta" entity={{ kind: 'user', id: '' }} clientOpts={{
                        baseUrl: process.env.NEXT_PUBLIC_MEMORY_API || 'http://localhost:5000/api/memory',
                        tokenProvider: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, localStorage.getItem('jwt') || ''];
                        }); }); }
                    }}/>}
              </>;
        })()}
            <div className="flex items-center space-x-1 mr-2">
              <div className={"w-2 h-2 rounded-full ".concat(isConnected ? 'bg-cyber-green animate-pulse' : 'bg-red-500')}></div>
              <span className={"text-xs font-medium ".concat(isConnected ? 'cyber-green' : 'text-red-400')}>
                {isConnected ? 'ON' : 'OFF'}
              </span>
            </div>
            
            {/* Integrations Dropdown */}
            <dropdown_menu_1.DropdownMenu open={integrationsOpen} onOpenChange={setIntegrationsOpen}>
              <dropdown_menu_1.DropdownMenuTrigger asChild>
                <button_1.Button size="sm" variant="ghost" className="px-2 py-1 text-xs">
                  <lucide_react_1.Plug className="w-3 h-3 mr-1"/>
                  Integrations
                  <lucide_react_1.ChevronDown className="w-3 h-3 ml-1"/>
                </button_1.Button>
              </dropdown_menu_1.DropdownMenuTrigger>
              <dropdown_menu_1.DropdownMenuContent align="end" className="bg-navy-800 border-navy-600">
                <dropdown_menu_1.DropdownMenuLabel className="text-slate-400 text-xs">Native Integrations</dropdown_menu_1.DropdownMenuLabel>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleZebulonIntegration}>
                  <lucide_react_1.Settings className="w-4 h-4 mr-2 cyber-green"/>
                  ZEBULON
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleZwapIntegration}>
                  <lucide_react_1.Zap className="w-4 h-4 mr-2 cyber-blue"/>
                  ZWAP! Exchange
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleZetaCoreIntegration}>
                  <lucide_react_1.Brain className="w-4 h-4 mr-2 text-purple-400"/>
                  Zeta Core AI
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleZincIntegration}>
                  <lucide_react_1.Command className="w-4 h-4 mr-2 text-orange-400"/>
                  Zinc
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuSeparator className="bg-navy-600"/>
                <dropdown_menu_1.DropdownMenuLabel className="text-slate-400 text-xs">External Integrations</dropdown_menu_1.DropdownMenuLabel>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={function () { toast({ title: "Security Platforms", description: "See How-To guides for SIEM & threat intel setup" }); setLocation('/how-to'); }}>
                  <lucide_react_1.Shield className="w-4 h-4 mr-2 text-blue-400"/>
                  Security Platforms
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={function () { toast({ title: "Cloud Services", description: "See How-To guides for cloud platform integration" }); setLocation('/how-to'); }}>
                  <lucide_react_1.Cloud className="w-4 h-4 mr-2 text-cyan-400"/>
                  Cloud Services
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={function () { toast({ title: "Custom APIs", description: "See How-To guides for custom integration builder" }); setLocation('/how-to'); }}>
                  <lucide_react_1.Code className="w-4 h-4 mr-2 text-green-400"/>
                  Custom APIs
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={function () { toast({ title: "Zapier", description: "See How-To guides for automation workflows" }); setLocation('/how-to'); }}>
                  <lucide_react_1.Workflow className="w-4 h-4 mr-2 text-yellow-400"/>
                  Zapier
                </dropdown_menu_1.DropdownMenuItem>
              </dropdown_menu_1.DropdownMenuContent>
            </dropdown_menu_1.DropdownMenu>

            {/* Security Controls Dropdown */}
            <dropdown_menu_1.DropdownMenu open={securityControlsOpen} onOpenChange={setSecurityControlsOpen}>
              <dropdown_menu_1.DropdownMenuTrigger asChild>
                <button_1.Button size="sm" variant="ghost" className="px-2 py-1 text-xs">
                  <lucide_react_1.Shield className="w-3 h-3 mr-1"/>
                  Security
                  <lucide_react_1.ChevronDown className="w-3 h-3 ml-1"/>
                </button_1.Button>
              </dropdown_menu_1.DropdownMenuTrigger>
              <dropdown_menu_1.DropdownMenuContent align="end" className="bg-navy-800 border-navy-600">
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleThreatReports}>
                  <lucide_react_1.AlertTriangle className="w-4 h-4 mr-2 text-orange-400"/>
                  Threat Reports
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleCorporateSabotage}>
                  <lucide_react_1.Users className="w-4 h-4 mr-2 text-red-400"/>
                  Corporate Sabotage
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleQuantumEncryption}>
                  <lucide_react_1.Lock className="w-4 h-4 mr-2 cyber-green"/>
                  Quantum Encryption
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleSystemMetrics}>
                  <lucide_react_1.Activity className="w-4 h-4 mr-2 cyber-blue"/>
                  System Metrics
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleEmergencyProtocols}>
                  <lucide_react_1.RefreshCw className="w-4 h-4 mr-2 cyber-green"/>
                  Emergency Protocols
                </dropdown_menu_1.DropdownMenuItem>
              </dropdown_menu_1.DropdownMenuContent>
            </dropdown_menu_1.DropdownMenu>

            {/* Quick Actions Dropdown */}
            <dropdown_menu_1.DropdownMenu>
              <dropdown_menu_1.DropdownMenuTrigger asChild>
                <button_1.Button size="sm" variant="ghost" className="px-2 py-1 text-xs">
                  <lucide_react_1.Command className="w-3 h-3 mr-1"/>
                  Actions
                  <lucide_react_1.ChevronDown className="w-3 h-3 ml-1"/>
                </button_1.Button>
              </dropdown_menu_1.DropdownMenuTrigger>
              <dropdown_menu_1.DropdownMenuContent align="end" className="bg-navy-800 border-navy-600">
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={refreshData}>
                  <lucide_react_1.RefreshCw className="w-4 h-4 mr-2 cyber-green"/>
                  Refresh All Systems
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleEmergencyLockdown}>
                  <lucide_react_1.AlertTriangle className="w-4 h-4 mr-2 text-orange-400"/>
                  Emergency Lock Down
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleSystemDiagnostics}>
                  <lucide_react_1.Settings className="w-4 h-4 mr-2 cyber-blue"/>
                  System Diagnostics
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuSeparator className="bg-navy-600"/>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={function () { return setLocation('/faq'); }}>
                  <lucide_react_1.HelpCircle className="w-4 h-4 mr-2 cyber-blue"/>
                  FAQ
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={function () { return setLocation('/how-to'); }}>
                  <lucide_react_1.BookOpen className="w-4 h-4 mr-2 cyber-green"/>
                  How-To Guides
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={function () { return setLocation('/admin'); }}>
                  <lucide_react_1.Settings className="w-4 h-4 mr-2 text-orange-400"/>
                  Admin Panel
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem className="text-slate-300 hover:bg-navy-700 focus:bg-navy-700 cursor-pointer" onClick={handleLogout}>
                  <lucide_react_1.RefreshCw className="w-4 h-4 mr-2 text-red-400"/>
                  Logout
                </dropdown_menu_1.DropdownMenuItem>
              </dropdown_menu_1.DropdownMenuContent>
            </dropdown_menu_1.DropdownMenu>
          </div>
        </div>
        

      </header>

      {/* Mobile Content */}
      <main className="px-4 py-4 space-y-6">
        

        {/* Zeta Core AI Status - Main Section */}
        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={zeta_logo_svg_1.default} alt="Zeta Core AI" className="h-8"/>
                <div>
                  <card_1.CardTitle className="text-lg text-white">Zeta Core AI</card_1.CardTitle>
                  <p className="text-xs text-slate-400">AI Security Sentry</p>
                </div>
              </div>
              <badge_1.Badge className={"".concat(isConnected ? 'bg-cyber-green/20 text-cyber-green' : 'bg-red-500/20 text-red-400')}>
                {isConnected ? 'ACTIVE' : 'OFFLINE'}
              </badge_1.Badge>
            </div>
          </card_1.CardHeader>
          <card_1.CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-700 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">AI Confidence</div>
                <div className="text-2xl font-bold cyber-green">
                  {((_b = (_a = securityData === null || securityData === void 0 ? void 0 : securityData.zetaCore) === null || _a === void 0 ? void 0 : _a.aiConfidence) === null || _b === void 0 ? void 0 : _b.toFixed(1)) || '98.7'}%
                </div>
              </div>
              <div className="bg-navy-700 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">Threats Blocked</div>
                <div className="text-2xl font-bold cyber-blue">
                  {((_d = (_c = securityData === null || securityData === void 0 ? void 0 : securityData.zetaCore) === null || _c === void 0 ? void 0 : _c.threatsBlocked) === null || _d === void 0 ? void 0 : _d.toLocaleString()) || '1,247'}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Neural Processing</span>
                <span className="cyber-green">{((_e = securityData === null || securityData === void 0 ? void 0 : securityData.zetaCore) === null || _e === void 0 ? void 0 : _e.neuralProcessing) || 96}%</span>
              </div>
              <div className="w-full bg-navy-600 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyber-green to-cyber-blue h-2 rounded-full transition-all duration-500" style={{ width: "".concat(((_f = securityData === null || securityData === void 0 ? void 0 : securityData.zetaCore) === null || _f === void 0 ? void 0 : _f.neuralProcessing) || 96, "%") }}/>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Quick Status Grid */}
        <div className="grid grid-cols-2 gap-3">
          <card_1.Card className="bg-navy-800 border-navy-600">
            <card_1.CardContent className="p-4 text-center">
              <lucide_react_1.Lock className="w-6 h-6 cyber-green mx-auto mb-2"/>
              <div className="text-sm font-medium text-white">Quantum Encryption</div>
              <div className="text-xs text-slate-400">4 Layers Active</div>
              <badge_1.Badge className="bg-cyber-green/20 text-cyber-green mt-2 text-xs">SECURE</badge_1.Badge>
            </card_1.CardContent>
          </card_1.Card>
          
          <card_1.Card className="bg-navy-800 border-navy-600">
            <card_1.CardContent className="p-4 text-center">
              <lucide_react_1.Zap className="w-6 h-6 cyber-blue mx-auto mb-2"/>
              <div className="text-sm font-medium text-white">ZWAP! Protection</div>
              <div className="text-xs text-slate-400">Exchange Secured</div>
              <badge_1.Badge className="bg-cyber-blue/20 text-cyber-blue mt-2 text-xs">PROTECTED</badge_1.Badge>
            </card_1.CardContent>
          </card_1.Card>
        </div>



        {/* Current Status Summary */}
        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">System Status</span>
              <badge_1.Badge className="bg-cyber-green/20 text-cyber-green">ALL SYSTEMS OPERATIONAL</badge_1.Badge>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div>🛡️ Quantum encryption layers active and verified</div>
              <div>🔍 Corporate sabotage patterns: 55 currently analyzing</div>
              <div>⚡ ZWAP!/XHI exchange protection enabled</div>
              <div>🌐 Ready for Zebulon Web3 Interface integration</div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

      </main>
    </div>);
}
