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
exports.default = HowTo;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var lucide_react_1 = require("lucide-react");
var wouter_1 = require("wouter");
function HowTo() {
    var _this = this;
    var _a = (0, react_1.useState)(""), searchQuery = _a[0], setSearchQuery = _a[1];
    var _b = (0, react_1.useState)(null), selectedCategory = _b[0], setSelectedCategory = _b[1];
    var _c = (0, react_1.useState)(null), selectedDifficulty = _c[0], setSelectedDifficulty = _c[1];
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['/api/how-to-guides'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/how-to-guides', {
                            credentials: 'include'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            // Return mock data for demo
                            return [2 /*return*/, [
                                    {
                                        id: 1,
                                        title: "Setting Up Your First Security Scan",
                                        description: "Learn how to configure and run your first comprehensive security scan",
                                        content: "# Setting Up Your First Security Scan\n\n## Overview\nThis guide will walk you through setting up and running your first security scan with Fantasma Firewall.\n\n## Prerequisites\n- Connected Web3 wallet\n- Active Fantasma Firewall dashboard access\n\n## Step 1: Access the Dashboard\n1. Navigate to the main dashboard\n2. Ensure your wallet is connected (green indicator in top right)\n3. Verify all systems show \"ONLINE\" status\n\n## Step 2: Configure Scan Parameters\n1. Click on \"Security Controls\" in the header\n2. Select \"Threat Reports\"\n3. Choose your scan scope:\n   - **Quick Scan**: Basic vulnerability check (5 minutes)\n   - **Deep Scan**: Comprehensive analysis (30 minutes)\n   - **Custom Scan**: Tailored to specific threats\n\n## Step 3: Run the Scan\n1. Click \"Start Security Scan\"\n2. Monitor progress in real-time\n3. Review threat detection alerts as they appear\n\n## Step 4: Review Results\n1. Access detailed threat reports\n2. Prioritize high-severity findings\n3. Apply recommended countermeasures\n\n## Troubleshooting\n- If scan fails to start, refresh the page and reconnect wallet\n- For timeout errors, try a quick scan first\n- Contact support for persistent issues",
                                        category: "Security",
                                        difficulty: "beginner",
                                        estimatedTime: "10 minutes",
                                        displayOrder: 1,
                                        isActive: true
                                    },
                                    {
                                        id: 2,
                                        title: "Configuring Quantum Encryption Layers",
                                        description: "Advanced setup for multi-layer quantum encryption protocols",
                                        content: "# Configuring Quantum Encryption Layers\n\n## Overview\nConfigure advanced quantum encryption for maximum security protection.\n\n## Prerequisites\n- Admin access to Fantasma Firewall\n- Understanding of encryption concepts\n- Minimum 1GB available bandwidth\n\n## Step 1: Access Quantum Controls\n1. Navigate to Security Controls \u2192 Quantum Encryption\n2. Verify current encryption status\n3. Check system compatibility\n\n## Step 2: Layer Configuration\n1. **Physical Layer**: Configure hardware-level encryption\n2. **Network Layer**: Set up transport encryption\n3. **Application Layer**: Enable API encryption\n4. **Quantum Layer**: Activate quantum protocols\n\n## Step 3: Advanced Settings\n1. Set key rotation frequency (recommended: 24 hours)\n2. Configure encryption strength (256-bit minimum)\n3. Enable automatic threat response\n\n## Step 4: Testing and Validation\n1. Run encryption integrity tests\n2. Verify all layers are active\n3. Monitor performance impact\n\n## Security Notes\n- Never disable all layers simultaneously\n- Backup configuration before changes\n- Test in development environment first",
                                        category: "Security",
                                        difficulty: "advanced",
                                        estimatedTime: "45 minutes",
                                        displayOrder: 2,
                                        isActive: true
                                    },
                                    {
                                        id: 3,
                                        title: "Emergency Response Procedures",
                                        description: "Critical steps to take during security incidents",
                                        content: "# Emergency Response Procedures\n\n## Overview\nQuick reference for handling security emergencies and threats.\n\n## Immediate Actions (First 60 seconds)\n1. **Assess the Threat**\n   - Check threat severity in dashboard\n   - Identify affected systems\n   - Determine scope of impact\n\n2. **Initiate Emergency Protocols**\n   - Navigate to Emergency Protocols page\n   - Click \"Emergency Lockdown\" if needed\n   - Deploy appropriate countermeasures\n\n3. **Communication**\n   - Alert relevant team members\n   - Document incident details\n   - Prepare status updates\n\n## Response Procedures by Threat Type\n\n### Corporate Sabotage\n1. Enable isolation protocols\n2. Deploy honeypot countermeasures\n3. Escalate to law enforcement if needed\n\n### AI Injection Attacks\n1. Activate quantum defense mode\n2. Isolate affected systems\n3. Run deep vulnerability scans\n\n### Market Manipulation\n1. Freeze ZWAP transactions temporarily\n2. Analyze trading patterns\n3. Report to regulatory authorities\n\n## Recovery Steps\n1. Verify threat elimination\n2. Restore normal operations gradually\n3. Conduct post-incident review\n4. Update security protocols\n\n## Prevention\n- Regular security drills\n- Keep systems updated\n- Monitor threat intelligence feeds",
                                        category: "Emergency",
                                        difficulty: "intermediate",
                                        estimatedTime: "15 minutes",
                                        displayOrder: 3,
                                        isActive: true
                                    },
                                    {
                                        id: 4,
                                        title: "Integrating with ZWAP Exchange",
                                        description: "Connect Fantasma Firewall with ZWAP exchange for enhanced protection",
                                        content: "# Integrating with ZWAP Exchange\n\n## Overview\nSecure your ZWAP exchange operations with Fantasma Firewall integration.\n\n## Setup Requirements\n- ZWAP exchange account\n- API access credentials\n- Admin privileges on both platforms\n\n## Step 1: API Configuration\n1. Generate API keys in ZWAP dashboard\n2. Add keys to Fantasma Firewall integrations\n3. Test connection with ping request\n\n## Step 2: Security Policies\n1. Configure transaction monitoring\n2. Set up suspicious activity alerts\n3. Enable automatic trade halting\n\n## Step 3: Real-time Monitoring\n1. Monitor trading patterns\n2. Track unusual volume spikes\n3. Detect potential manipulation\n\n## Best Practices\n- Regularly rotate API keys\n- Monitor integration logs\n- Test emergency procedures\n- Keep backup access methods",
                                        category: "Integration",
                                        difficulty: "intermediate",
                                        estimatedTime: "30 minutes",
                                        displayOrder: 4,
                                        isActive: true
                                    }
                                ]];
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
    }), howToGuides = _d.data, isLoading = _d.isLoading;
    var categories = Array.from(new Set((howToGuides === null || howToGuides === void 0 ? void 0 : howToGuides.map(function (guide) { return guide.category; })) || []));
    var difficulties = ["beginner", "intermediate", "advanced"];
    var filteredGuides = (howToGuides === null || howToGuides === void 0 ? void 0 : howToGuides.filter(function (guide) {
        var matchesSearch = !searchQuery ||
            guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchQuery.toLowerCase());
        var matchesCategory = !selectedCategory || guide.category === selectedCategory;
        var matchesDifficulty = !selectedDifficulty || guide.difficulty === selectedDifficulty;
        return matchesSearch && matchesCategory && matchesDifficulty && guide.isActive;
    })) || [];
    var getDifficultyColor = function (difficulty) {
        switch (difficulty) {
            case 'beginner': return 'bg-green-600';
            case 'intermediate': return 'bg-yellow-600';
            case 'advanced': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };
    var getCategoryColor = function (category) {
        switch (category) {
            case 'Security': return 'bg-cyber-blue';
            case 'Emergency': return 'bg-red-600';
            case 'Integration': return 'bg-purple-600';
            case 'Setup': return 'bg-green-600';
            default: return 'bg-gray-600';
        }
    };
    return (<div className="min-h-screen bg-navy-900 text-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <wouter_1.Link href="/dashboard">
              <button_1.Button variant="ghost" size="sm">
                <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
                Back to Dashboard
              </button_1.Button>
            </wouter_1.Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <lucide_react_1.BookOpen className="w-6 h-6 mr-2 text-cyber-blue"/>
                How-To Guides
              </h1>
              <p className="text-slate-400">Step-by-step instructions for Fantasma Firewall features</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <card_1.Card className="bg-navy-800 border-navy-600 mb-6">
          <card_1.CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"/>
                <input_1.Input placeholder="Search guides..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="pl-10 bg-navy-700 border-navy-600 text-white"/>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm text-slate-400 flex items-center">Category:</span>
                  <button_1.Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={function () { return setSelectedCategory(null); }} className="text-xs">
                    All
                  </button_1.Button>
                  {categories.map(function (category) { return (<button_1.Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={function () { return setSelectedCategory(category); }} className="text-xs">
                      {category}
                    </button_1.Button>); })}
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm text-slate-400 flex items-center">Difficulty:</span>
                  <button_1.Button variant={selectedDifficulty === null ? "default" : "outline"} size="sm" onClick={function () { return setSelectedDifficulty(null); }} className="text-xs">
                    All
                  </button_1.Button>
                  {difficulties.map(function (difficulty) { return (<button_1.Button key={difficulty} variant={selectedDifficulty === difficulty ? "default" : "outline"} size="sm" onClick={function () { return setSelectedDifficulty(difficulty); }} className="text-xs capitalize">
                      {difficulty}
                    </button_1.Button>); })}
                </div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {isLoading ? (<div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading guides...</p>
          </div>) : (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.length === 0 ? (<div className="col-span-full">
                <card_1.Card className="bg-navy-800 border-navy-600">
                  <card_1.CardContent className="text-center py-8">
                    <lucide_react_1.BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4"/>
                    <p className="text-slate-300">No guides found</p>
                    <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
                  </card_1.CardContent>
                </card_1.Card>
              </div>) : (filteredGuides.map(function (guide) { return (<wouter_1.Link key={guide.id} href={"/how-to/".concat(guide.id)}>
                  <card_1.Card className="bg-navy-800 border-navy-600 hover:border-navy-500 transition-colors cursor-pointer h-full">
                    <card_1.CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <badge_1.Badge className={getCategoryColor(guide.category)}>
                          {guide.category}
                        </badge_1.Badge>
                        <badge_1.Badge className={getDifficultyColor(guide.difficulty)}>
                          {guide.difficulty}
                        </badge_1.Badge>
                      </div>
                      <card_1.CardTitle className="text-white text-lg line-clamp-2">
                        {guide.title}
                      </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                        {guide.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <lucide_react_1.Clock className="w-3 h-3"/>
                          {guide.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <lucide_react_1.User className="w-3 h-3"/>
                          {guide.difficulty}
                        </div>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>
                </wouter_1.Link>); }))}
          </div>)}

        {/* Need Help Section */}
        <card_1.Card className="bg-navy-800 border-navy-600 mt-8">
          <card_1.CardContent className="text-center py-6">
            <h3 className="text-white font-medium mb-2">Need more help?</h3>
            <p className="text-slate-400 text-sm mb-4">
              Check our FAQ section or contact support for personalized assistance.
            </p>
            <div className="flex justify-center gap-3">
              <wouter_1.Link href="/faq">
                <button_1.Button variant="outline" size="sm">
                  View FAQ
                </button_1.Button>
              </wouter_1.Link>
              <button_1.Button size="sm" className="bg-cyber-blue hover:bg-blue-600">
                Contact Support
              </button_1.Button>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
}
