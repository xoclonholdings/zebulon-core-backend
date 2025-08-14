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
exports.default = AdminPanel;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var tabs_1 = require("@/components/ui/tabs");
var dialog_1 = require("@/components/ui/dialog");
var lucide_react_1 = require("lucide-react");
var wouter_1 = require("wouter");
var use_toast_1 = require("@/hooks/use-toast");
function AdminPanel() {
    var _this = this;
    var _a, _b, _c;
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _d = (0, react_1.useState)("faq"), activeTab = _d[0], setActiveTab = _d[1];
    var _e = (0, react_1.useState)(null), editingItem = _e[0], setEditingItem = _e[1];
    var _f = (0, react_1.useState)(false), isDialogOpen = _f[0], setIsDialogOpen = _f[1];
    // FAQ Data
    var faqData = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/faq'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock data for demo
                return [2 /*return*/, {
                        categories: [
                            { id: 1, name: "Getting Started", description: "Basic setup and configuration", displayOrder: 1, isActive: true },
                            { id: 2, name: "Security Features", description: "Understanding security tools", displayOrder: 2, isActive: true },
                            { id: 3, name: "Troubleshooting", description: "Common issues and solutions", displayOrder: 3, isActive: true }
                        ],
                        items: [
                            { id: 1, categoryId: 1, question: "What is Fantasma Firewall?", answer: "AI-driven security platform...", displayOrder: 1, isActive: true },
                            { id: 2, categoryId: 1, question: "How do I connect my wallet?", answer: "Click the wallet connection button...", displayOrder: 2, isActive: true }
                        ]
                    }];
            });
        }); },
    }).data;
    // How-To Data
    var howToGuides = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/how-to-guides'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock data for demo
                return [2 /*return*/, [
                        { id: 1, title: "Setting Up Security Scan", description: "Configure your first scan", category: "Security", difficulty: "beginner", estimatedTime: "10 minutes", isActive: true },
                        { id: 2, title: "Quantum Encryption Setup", description: "Advanced encryption configuration", category: "Security", difficulty: "advanced", estimatedTime: "45 minutes", isActive: true }
                    ]];
            });
        }); },
    }).data;
    // FAQ Mutations
    var createFaqItem = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/admin/faq/items', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to create FAQ item');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({ title: "Success", description: "FAQ item created successfully" });
            queryClient.invalidateQueries({ queryKey: ['/api/admin/faq'] });
            setIsDialogOpen(false);
            setEditingItem(null);
        }
    });
    var updateFaqItem = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/admin/faq/items/".concat(data.id), {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to update FAQ item');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({ title: "Success", description: "FAQ item updated successfully" });
            queryClient.invalidateQueries({ queryKey: ['/api/admin/faq'] });
            setIsDialogOpen(false);
            setEditingItem(null);
        }
    });
    var deleteFaqItem = (0, react_query_1.useMutation)({
        mutationFn: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/admin/faq/items/".concat(id), {
                            method: 'DELETE'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to delete FAQ item');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({ title: "Success", description: "FAQ item deleted successfully" });
            queryClient.invalidateQueries({ queryKey: ['/api/admin/faq'] });
        }
    });
    // How-To Mutations
    var createHowToGuide = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/admin/how-to-guides', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to create guide');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({ title: "Success", description: "How-to guide created successfully" });
            queryClient.invalidateQueries({ queryKey: ['/api/admin/how-to-guides'] });
            setIsDialogOpen(false);
            setEditingItem(null);
        }
    });
    var updateHowToGuide = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/admin/how-to-guides/".concat(data.id), {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to update guide');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({ title: "Success", description: "How-to guide updated successfully" });
            queryClient.invalidateQueries({ queryKey: ['/api/admin/how-to-guides'] });
            setIsDialogOpen(false);
            setEditingItem(null);
        }
    });
    var deleteHowToGuide = (0, react_query_1.useMutation)({
        mutationFn: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/admin/how-to-guides/".concat(id), {
                            method: 'DELETE'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to delete guide');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({ title: "Success", description: "How-to guide deleted successfully" });
            queryClient.invalidateQueries({ queryKey: ['/api/admin/how-to-guides'] });
        }
    });
    var handleEditItem = function (item, type) {
        setEditingItem(__assign(__assign({}, item), { type: type }));
        setIsDialogOpen(true);
    };
    var handleSaveItem = function (formData) {
        var data = Object.fromEntries(formData.entries());
        if ((editingItem === null || editingItem === void 0 ? void 0 : editingItem.type) === 'faq') {
            if (editingItem.id) {
                updateFaqItem.mutate(__assign(__assign({}, data), { id: editingItem.id }));
            }
            else {
                createFaqItem.mutate(data);
            }
        }
        else if ((editingItem === null || editingItem === void 0 ? void 0 : editingItem.type) === 'guide') {
            if (editingItem.id) {
                updateHowToGuide.mutate(__assign(__assign({}, data), { id: editingItem.id }));
            }
            else {
                createHowToGuide.mutate(data);
            }
        }
    };
    return (<div className="min-h-screen bg-navy-900 text-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
                <lucide_react_1.Settings className="w-6 h-6 mr-2 text-cyber-blue"/>
                Admin Panel
              </h1>
              <p className="text-slate-400">Manage FAQ and How-To content</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab}>
          <tabs_1.TabsList className="bg-navy-800 border-navy-600">
            <tabs_1.TabsTrigger value="faq" className="data-[state=active]:bg-cyber-blue">
              <lucide_react_1.HelpCircle className="w-4 h-4 mr-2"/>
              FAQ Management
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="guides" className="data-[state=active]:bg-cyber-blue">
              <lucide_react_1.BookOpen className="w-4 h-4 mr-2"/>
              How-To Guides
            </tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          {/* FAQ Management */}
          <tabs_1.TabsContent value="faq" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">FAQ Items</h2>
              <button_1.Button onClick={function () {
            setEditingItem({ type: 'faq' });
            setIsDialogOpen(true);
        }} className="bg-cyber-blue hover:bg-blue-600">
                <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                Add FAQ Item
              </button_1.Button>
            </div>

            <div className="grid gap-4">
              {(_a = faqData === null || faqData === void 0 ? void 0 : faqData.items) === null || _a === void 0 ? void 0 : _a.map(function (item) {
            var _a;
            return (<card_1.Card key={item.id} className="bg-navy-800 border-navy-600">
                  <card_1.CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <card_1.CardTitle className="text-white text-lg">{item.question}</card_1.CardTitle>
                        <badge_1.Badge variant="outline" className="mt-2">
                          {((_a = faqData.categories.find(function (cat) { return cat.id === item.categoryId; })) === null || _a === void 0 ? void 0 : _a.name) || 'Uncategorized'}
                        </badge_1.Badge>
                      </div>
                      <div className="flex gap-2">
                        <button_1.Button size="sm" variant="outline" onClick={function () { return handleEditItem(item, 'faq'); }}>
                          <lucide_react_1.Edit className="w-4 h-4"/>
                        </button_1.Button>
                        <button_1.Button size="sm" variant="outline" onClick={function () { return deleteFaqItem.mutate(item.id); }} className="text-red-400 hover:text-red-300">
                          <lucide_react_1.Trash2 className="w-4 h-4"/>
                        </button_1.Button>
                      </div>
                    </div>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <p className="text-slate-300 text-sm">{item.answer}</p>
                  </card_1.CardContent>
                </card_1.Card>);
        })}
            </div>
          </tabs_1.TabsContent>

          {/* How-To Guides Management */}
          <tabs_1.TabsContent value="guides" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">How-To Guides</h2>
              <button_1.Button onClick={function () {
            setEditingItem({ type: 'guide' });
            setIsDialogOpen(true);
        }} className="bg-cyber-blue hover:bg-blue-600">
                <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                Add Guide
              </button_1.Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {howToGuides === null || howToGuides === void 0 ? void 0 : howToGuides.map(function (guide) { return (<card_1.Card key={guide.id} className="bg-navy-800 border-navy-600">
                  <card_1.CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <card_1.CardTitle className="text-white text-lg">{guide.title}</card_1.CardTitle>
                        <div className="flex gap-2 mt-2">
                          <badge_1.Badge variant="outline">{guide.category}</badge_1.Badge>
                          <badge_1.Badge variant="outline">{guide.difficulty}</badge_1.Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button_1.Button size="sm" variant="outline" onClick={function () { return handleEditItem(guide, 'guide'); }}>
                          <lucide_react_1.Edit className="w-4 h-4"/>
                        </button_1.Button>
                        <button_1.Button size="sm" variant="outline" onClick={function () { return deleteHowToGuide.mutate(guide.id); }} className="text-red-400 hover:text-red-300">
                          <lucide_react_1.Trash2 className="w-4 h-4"/>
                        </button_1.Button>
                      </div>
                    </div>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <p className="text-slate-300 text-sm">{guide.description}</p>
                    <p className="text-slate-400 text-xs mt-2">Time: {guide.estimatedTime}</p>
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>

        {/* Edit Dialog */}
        <dialog_1.Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <dialog_1.DialogContent className="bg-navy-800 border-navy-600 text-white max-w-2xl">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>
                {(editingItem === null || editingItem === void 0 ? void 0 : editingItem.id) ? 'Edit' : 'Create'} {(editingItem === null || editingItem === void 0 ? void 0 : editingItem.type) === 'faq' ? 'FAQ Item' : 'How-To Guide'}
              </dialog_1.DialogTitle>
            </dialog_1.DialogHeader>
            
            <form onSubmit={function (e) {
            e.preventDefault();
            handleSaveItem(new FormData(e.target));
        }} className="space-y-4">
              {(editingItem === null || editingItem === void 0 ? void 0 : editingItem.type) === 'faq' ? (<>
                  <div>
                    <label_1.Label htmlFor="question">Question</label_1.Label>
                    <input_1.Input id="question" name="question" defaultValue={editingItem === null || editingItem === void 0 ? void 0 : editingItem.question} required className="bg-navy-700 border-navy-600 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="answer">Answer</label_1.Label>
                    <textarea_1.Textarea id="answer" name="answer" defaultValue={editingItem === null || editingItem === void 0 ? void 0 : editingItem.answer} required rows={4} className="bg-navy-700 border-navy-600 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="categoryId">Category</label_1.Label>
                    <select_1.Select name="categoryId" defaultValue={(_b = editingItem === null || editingItem === void 0 ? void 0 : editingItem.categoryId) === null || _b === void 0 ? void 0 : _b.toString()}>
                      <select_1.SelectTrigger className="bg-navy-700 border-navy-600 text-white">
                        <select_1.SelectValue placeholder="Select category"/>
                      </select_1.SelectTrigger>
                      <select_1.SelectContent className="bg-navy-700 border-navy-600">
                        {(_c = faqData === null || faqData === void 0 ? void 0 : faqData.categories) === null || _c === void 0 ? void 0 : _c.map(function (cat) { return (<select_1.SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </select_1.SelectItem>); })}
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                </>) : (<>
                  <div>
                    <label_1.Label htmlFor="title">Title</label_1.Label>
                    <input_1.Input id="title" name="title" defaultValue={editingItem === null || editingItem === void 0 ? void 0 : editingItem.title} required className="bg-navy-700 border-navy-600 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="description">Description</label_1.Label>
                    <textarea_1.Textarea id="description" name="description" defaultValue={editingItem === null || editingItem === void 0 ? void 0 : editingItem.description} required rows={2} className="bg-navy-700 border-navy-600 text-white"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label_1.Label htmlFor="category">Category</label_1.Label>
                      <input_1.Input id="category" name="category" defaultValue={editingItem === null || editingItem === void 0 ? void 0 : editingItem.category} required className="bg-navy-700 border-navy-600 text-white"/>
                    </div>
                    <div>
                      <label_1.Label htmlFor="difficulty">Difficulty</label_1.Label>
                      <select_1.Select name="difficulty" defaultValue={editingItem === null || editingItem === void 0 ? void 0 : editingItem.difficulty}>
                        <select_1.SelectTrigger className="bg-navy-700 border-navy-600 text-white">
                          <select_1.SelectValue placeholder="Select difficulty"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent className="bg-navy-700 border-navy-600">
                          <select_1.SelectItem value="beginner">Beginner</select_1.SelectItem>
                          <select_1.SelectItem value="intermediate">Intermediate</select_1.SelectItem>
                          <select_1.SelectItem value="advanced">Advanced</select_1.SelectItem>
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                  </div>
                  <div>
                    <label_1.Label htmlFor="estimatedTime">Estimated Time</label_1.Label>
                    <input_1.Input id="estimatedTime" name="estimatedTime" defaultValue={editingItem === null || editingItem === void 0 ? void 0 : editingItem.estimatedTime} placeholder="e.g., 10 minutes" className="bg-navy-700 border-navy-600 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="content">Content (Markdown)</label_1.Label>
                    <textarea_1.Textarea id="content" name="content" defaultValue={editingItem === null || editingItem === void 0 ? void 0 : editingItem.content} required rows={8} className="bg-navy-700 border-navy-600 text-white font-mono text-sm"/>
                  </div>
                </>)}
              
              <div className="flex justify-end gap-3">
                <button_1.Button type="button" variant="outline" onClick={function () { return setIsDialogOpen(false); }}>
                  Cancel
                </button_1.Button>
                <button_1.Button type="submit" className="bg-cyber-blue hover:bg-blue-600">
                  <lucide_react_1.Save className="w-4 h-4 mr-2"/>
                  Save
                </button_1.Button>
              </div>
            </form>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>
      </div>
    </div>);
}
