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
exports.default = FAQ;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var collapsible_1 = require("@/components/ui/collapsible");
var lucide_react_1 = require("lucide-react");
var wouter_1 = require("wouter");
function FAQ() {
    var _this = this;
    var _a, _b;
    var _c = (0, react_1.useState)(""), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = (0, react_1.useState)(null), selectedCategory = _d[0], setSelectedCategory = _d[1];
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['/api/faq'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/faq', {
                            credentials: 'include'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            // Return mock data for demo
                            return [2 /*return*/, {
                                    categories: [
                                        {
                                            id: 1,
                                            name: "Getting Started",
                                            description: "Basic setup and initial configuration",
                                            displayOrder: 1,
                                            isActive: true
                                        },
                                        {
                                            id: 2,
                                            name: "Security Features",
                                            description: "Understanding Fantasma Firewall security tools",
                                            displayOrder: 2,
                                            isActive: true
                                        },
                                        {
                                            id: 3,
                                            name: "Troubleshooting",
                                            description: "Common issues and solutions",
                                            displayOrder: 3,
                                            isActive: true
                                        }
                                    ],
                                    items: [
                                        {
                                            id: 1,
                                            categoryId: 1,
                                            question: "What is Fantasma Firewall?",
                                            answer: "Fantasma Firewall is an AI-driven security platform designed to protect Web3 financial ecosystems. It features intelligent threat detection, quantum encryption, and comprehensive monitoring of blockchain vulnerabilities.",
                                            displayOrder: 1,
                                            isActive: true
                                        },
                                        {
                                            id: 2,
                                            categoryId: 1,
                                            question: "How do I connect my wallet?",
                                            answer: "Click the wallet connection button in the top right corner of the dashboard. Fantasma Firewall supports MetaMask, Coinbase Wallet, and other Web3-compatible wallets. Follow the prompts to securely connect your wallet.",
                                            displayOrder: 2,
                                            isActive: true
                                        },
                                        {
                                            id: 3,
                                            categoryId: 2,
                                            question: "What is Zeta Core AI?",
                                            answer: "Zeta Core AI is the intelligent threat detection engine that powers Fantasma Firewall. It continuously analyzes patterns, assigns confidence scores, and provides real-time threat assessment with neural processing capabilities.",
                                            displayOrder: 1,
                                            isActive: true
                                        },
                                        {
                                            id: 4,
                                            categoryId: 2,
                                            question: "How does Quantum Encryption work?",
                                            answer: "Our quantum encryption system provides multi-layer security protection using advanced quantum protocols. It includes multiple encryption layers, quantum isolation protocols, and real-time key rotation for maximum security.",
                                            displayOrder: 2,
                                            isActive: true
                                        },
                                        {
                                            id: 5,
                                            categoryId: 3,
                                            question: "Why am I getting authentication errors?",
                                            answer: "Authentication errors typically occur when your wallet connection expires or when switching between accounts. Try refreshing the page and reconnecting your wallet. Ensure your wallet extension is enabled and unlocked.",
                                            displayOrder: 1,
                                            isActive: true
                                        },
                                        {
                                            id: 6,
                                            categoryId: 3,
                                            question: "What should I do if I see suspicious activity?",
                                            answer: "Immediately use the Emergency Lockdown feature in the Quick Actions menu. Review the Threat Reports for detailed analysis, and contact support if the threat persists. Our AI continuously monitors and responds to threats automatically.",
                                            displayOrder: 2,
                                            isActive: true
                                        }
                                    ]
                                }];
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
    }), faqData = _e.data, isLoading = _e.isLoading;
    var filteredItems = ((_a = faqData === null || faqData === void 0 ? void 0 : faqData.items) === null || _a === void 0 ? void 0 : _a.filter(function (item) {
        var matchesSearch = !searchQuery ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        var matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
        return matchesSearch && matchesCategory && item.isActive;
    })) || [];
    var activeCategories = ((_b = faqData === null || faqData === void 0 ? void 0 : faqData.categories) === null || _b === void 0 ? void 0 : _b.filter(function (cat) { return cat.isActive; })) || [];
    return (<div className="min-h-screen bg-navy-900 text-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
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
                <lucide_react_1.HelpCircle className="w-6 h-6 mr-2 text-cyber-blue"/>
                Frequently Asked Questions
              </h1>
              <p className="text-slate-400">Find answers to common questions about Fantasma Firewall</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <card_1.Card className="bg-navy-800 border-navy-600 mb-6">
          <card_1.CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"/>
                <input_1.Input placeholder="Search FAQ..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="pl-10 bg-navy-700 border-navy-600 text-white"/>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button_1.Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={function () { return setSelectedCategory(null); }} className="text-xs">
                  All Categories
                </button_1.Button>
                {activeCategories.map(function (category) { return (<button_1.Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} size="sm" onClick={function () { return setSelectedCategory(category.id); }} className="text-xs">
                    {category.name}
                  </button_1.Button>); })}
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {isLoading ? (<div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading FAQ...</p>
          </div>) : (<div className="space-y-4">
            {filteredItems.length === 0 ? (<card_1.Card className="bg-navy-800 border-navy-600">
                <card_1.CardContent className="text-center py-8">
                  <lucide_react_1.HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4"/>
                  <p className="text-slate-300">No FAQ items found</p>
                  <p className="text-slate-400 text-sm">Try adjusting your search or category filter</p>
                </card_1.CardContent>
              </card_1.Card>) : (filteredItems.map(function (item) {
                var category = activeCategories.find(function (cat) { return cat.id === item.categoryId; });
                return (<collapsible_1.Collapsible key={item.id}>
                    <card_1.Card className="bg-navy-800 border-navy-600 hover:border-navy-500 transition-colors">
                      <collapsible_1.CollapsibleTrigger asChild>
                        <card_1.CardHeader className="cursor-pointer hover:bg-navy-750">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start space-x-3">
                              <lucide_react_1.HelpCircle className="w-5 h-5 text-cyber-blue mt-1 flex-shrink-0"/>
                              <div className="text-left">
                                <card_1.CardTitle className="text-white text-lg">{item.question}</card_1.CardTitle>
                                {category && (<badge_1.Badge variant="outline" className="mt-2 text-xs">
                                    {category.name}
                                  </badge_1.Badge>)}
                              </div>
                            </div>
                            <lucide_react_1.ChevronDown className="w-5 h-5 text-slate-400"/>
                          </div>
                        </card_1.CardHeader>
                      </collapsible_1.CollapsibleTrigger>
                      <collapsible_1.CollapsibleContent>
                        <card_1.CardContent className="pt-0">
                          <div className="ml-8 text-slate-300 leading-relaxed">
                            {item.answer}
                          </div>
                        </card_1.CardContent>
                      </collapsible_1.CollapsibleContent>
                    </card_1.Card>
                  </collapsible_1.Collapsible>);
            }))}
          </div>)}

        {/* Contact Support */}
        <card_1.Card className="bg-navy-800 border-navy-600 mt-8">
          <card_1.CardContent className="text-center py-6">
            <h3 className="text-white font-medium mb-2">Can't find what you're looking for?</h3>
            <p className="text-slate-400 text-sm mb-4">
              Contact our support team or check our How-To guides for detailed instructions.
            </p>
            <div className="flex justify-center gap-3">
              <wouter_1.Link href="/how-to">
                <button_1.Button variant="outline" size="sm">
                  View How-To Guides
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
