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
exports.default = HowToDetail;
var react_query_1 = require("@tanstack/react-query");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var wouter_1 = require("wouter");
var react_markdown_1 = require("react-markdown");
function HowToDetail() {
    var _this = this;
    var _a = (0, wouter_1.useRoute)("/how-to/:id"), match = _a[0], params = _a[1];
    var guideId = params === null || params === void 0 ? void 0 : params.id;
    var _b = (0, react_query_1.useQuery)({
        queryKey: ['/api/how-to-guides', guideId],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/how-to-guides/".concat(guideId), {
                            credentials: 'include'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            // Return mock data for demo
                            return [2 /*return*/, {
                                    id: parseInt(guideId || "1"),
                                    title: "Setting Up Your First Security Scan",
                                    description: "Learn how to configure and run your first comprehensive security scan",
                                    content: "# Setting Up Your First Security Scan\n\n## Overview\nThis guide will walk you through setting up and running your first security scan with Fantasma Firewall.\n\n## Prerequisites\n- Connected Web3 wallet\n- Active Fantasma Firewall dashboard access\n\n## Step 1: Access the Dashboard\n1. Navigate to the main dashboard\n2. Ensure your wallet is connected (green indicator in top right)\n3. Verify all systems show \"ONLINE\" status\n\n## Step 2: Configure Scan Parameters\n1. Click on \"Security Controls\" in the header\n2. Select \"Threat Reports\"\n3. Choose your scan scope:\n   - **Quick Scan**: Basic vulnerability check (5 minutes)\n   - **Deep Scan**: Comprehensive analysis (30 minutes)\n   - **Custom Scan**: Tailored to specific threats\n\n## Step 3: Run the Scan\n1. Click \"Start Security Scan\"\n2. Monitor progress in real-time\n3. Review threat detection alerts as they appear\n\n## Step 4: Review Results\n1. Access detailed threat reports\n2. Prioritize high-severity findings\n3. Apply recommended countermeasures\n\n## Troubleshooting\n- If scan fails to start, refresh the page and reconnect wallet\n- For timeout errors, try a quick scan first\n- Contact support for persistent issues",
                                    category: "Security",
                                    difficulty: "beginner",
                                    estimatedTime: "10 minutes",
                                    isActive: true
                                }];
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        enabled: !!guideId,
    }), guide = _b.data, isLoading = _b.isLoading;
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
    if (isLoading) {
        return (<div className="min-h-screen bg-navy-900 text-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading guide...</p>
          </div>
        </div>
      </div>);
    }
    if (!guide) {
        return (<div className="min-h-screen bg-navy-900 text-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <lucide_react_1.BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4"/>
            <p className="text-slate-300">Guide not found</p>
            <wouter_1.Link href="/how-to">
              <button_1.Button className="mt-4">Back to Guides</button_1.Button>
            </wouter_1.Link>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-navy-900 text-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <wouter_1.Link href="/how-to">
              <button_1.Button variant="ghost" size="sm">
                <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
                Back to Guides
              </button_1.Button>
            </wouter_1.Link>
          </div>
        </div>

        {/* Guide Header */}
        <card_1.Card className="bg-navy-800 border-navy-600 mb-6">
          <card_1.CardHeader>
            <div className="flex justify-between items-start mb-4">
              <badge_1.Badge className={getCategoryColor(guide.category)}>
                {guide.category}
              </badge_1.Badge>
              <badge_1.Badge className={getDifficultyColor(guide.difficulty)}>
                {guide.difficulty}
              </badge_1.Badge>
            </div>
            <card_1.CardTitle className="text-2xl text-white mb-2">
              {guide.title}
            </card_1.CardTitle>
            <p className="text-slate-300 text-lg">
              {guide.description}
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400 mt-4">
              <div className="flex items-center gap-2">
                <lucide_react_1.Clock className="w-4 h-4"/>
                <span>Estimated time: {guide.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <lucide_react_1.User className="w-4 h-4"/>
                <span>Difficulty: {guide.difficulty}</span>
              </div>
            </div>
          </card_1.CardHeader>
        </card_1.Card>

        {/* Guide Content */}
        <card_1.Card className="bg-navy-800 border-navy-600">
          <card_1.CardContent className="p-8">
            <div className="prose prose-slate prose-invert max-w-none">
              <react_markdown_1.default components={{
            h1: function (_a) {
                var children = _a.children;
                return <h1 className="text-3xl font-bold text-white mb-6">{children}</h1>;
            },
            h2: function (_a) {
                var children = _a.children;
                return <h2 className="text-2xl font-semibold text-white mb-4 mt-8">{children}</h2>;
            },
            h3: function (_a) {
                var children = _a.children;
                return <h3 className="text-xl font-medium text-white mb-3 mt-6">{children}</h3>;
            },
            p: function (_a) {
                var children = _a.children;
                return <p className="text-slate-300 mb-4 leading-relaxed">{children}</p>;
            },
            ul: function (_a) {
                var children = _a.children;
                return <ul className="text-slate-300 mb-4 space-y-2">{children}</ul>;
            },
            ol: function (_a) {
                var children = _a.children;
                return <ol className="text-slate-300 mb-4 space-y-2 list-decimal list-inside">{children}</ol>;
            },
            li: function (_a) {
                var children = _a.children;
                return <li className="text-slate-300">{children}</li>;
            },
            strong: function (_a) {
                var children = _a.children;
                return <strong className="text-white font-semibold">{children}</strong>;
            },
            code: function (_a) {
                var children = _a.children;
                return <code className="bg-navy-700 text-cyber-blue px-2 py-1 rounded text-sm">{children}</code>;
            },
            blockquote: function (_a) {
                var children = _a.children;
                return (<blockquote className="border-l-4 border-cyber-blue bg-navy-700 p-4 my-4 rounded">
                      {children}
                    </blockquote>);
            },
        }}>
                {guide.content}
              </react_markdown_1.default>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <wouter_1.Link href="/how-to">
            <button_1.Button variant="outline">
              <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
              All Guides
            </button_1.Button>
          </wouter_1.Link>
          <div className="flex gap-3">
            <wouter_1.Link href="/faq">
              <button_1.Button variant="outline">
                View FAQ
              </button_1.Button>
            </wouter_1.Link>
            <button_1.Button className="bg-cyber-blue hover:bg-blue-600">
              Contact Support
            </button_1.Button>
          </div>
        </div>
      </div>
    </div>);
}
