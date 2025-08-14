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
exports.default = OracleDatabase;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var badge_1 = require("@/components/ui/badge");
var card_1 = require("@/components/ui/card");
var dialog_1 = require("@/components/ui/dialog");
var table_1 = require("@/components/ui/table");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
var use_toast_1 = require("@/hooks/use-toast");
function OracleDatabase(_a) {
    var _this = this;
    var onClose = _a.onClose;
    var _b = (0, react_1.useState)([]), memories = _b[0], setMemories = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), searchTerm = _d[0], setSearchTerm = _d[1];
    var _e = (0, react_1.useState)('all'), statusFilter = _e[0], setStatusFilter = _e[1];
    var _f = (0, react_1.useState)('all'), typeFilter = _f[0], setTypeFilter = _f[1];
    var _g = (0, react_1.useState)(false), isStoreDialogOpen = _g[0], setIsStoreDialogOpen = _g[1];
    var _h = (0, react_1.useState)(null), selectedMemory = _h[0], setSelectedMemory = _h[1];
    var _j = (0, react_1.useState)(false), isViewDialogOpen = _j[0], setIsViewDialogOpen = _j[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var _k = (0, react_1.useState)({
        label: '',
        description: '',
        content: '',
        memoryType: 'custom'
    }), newMemory = _k[0], setNewMemory = _k[1];
    var memoryTypes = [
        { value: 'workflow', label: 'Workflow', icon: <lucide_react_1.FileText className="w-4 h-4"/> },
        { value: 'response', label: 'Response', icon: <lucide_react_1.FileText className="w-4 h-4"/> },
        { value: 'repair', label: 'Repair', icon: <lucide_react_1.Shield className="w-4 h-4"/> },
        { value: 'security', label: 'Security', icon: <lucide_react_1.Shield className="w-4 h-4"/> },
        { value: 'data-tag', label: 'Data Tag', icon: <lucide_react_1.Database className="w-4 h-4"/> },
        { value: 'custom', label: 'Custom', icon: <lucide_react_1.FileText className="w-4 h-4"/> }
    ];
    var fetchMemories = function () { return __awaiter(_this, void 0, void 0, function () {
        var params, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    params = new URLSearchParams();
                    if (searchTerm)
                        params.append('search', searchTerm);
                    if (statusFilter !== 'all')
                        params.append('status', statusFilter);
                    if (typeFilter !== 'all')
                        params.append('type', typeFilter);
                    return [4 /*yield*/, fetch("/api/oracle/memories?".concat(params))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setMemories(data.memories || []);
                    return [3 /*break*/, 4];
                case 3:
                    toast({
                        title: "Error",
                        description: "Failed to fetch Oracle memories",
                        variant: "destructive"
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    // Error fetching memories
                    toast({
                        title: "Error",
                        description: "Failed to fetch Oracle memories",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchMemories();
    }, [searchTerm, statusFilter, typeFilter]);
    var handleStoreMemory = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, error, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newMemory.label || !newMemory.description || !newMemory.content) {
                        toast({
                            title: "Error",
                            description: "All fields are required",
                            variant: "destructive"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch('/api/oracle/store', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newMemory)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast({
                        title: "Success",
                        description: "Memory stored successfully"
                    });
                    setNewMemory({ label: '', description: '', content: '', memoryType: 'custom' });
                    setIsStoreDialogOpen(false);
                    fetchMemories();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    error = _a.sent();
                    toast({
                        title: "Error",
                        description: error.error || "Failed to store memory",
                        variant: "destructive"
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    // Error storing memory
                    toast({
                        title: "Error",
                        description: "Failed to store memory",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleLock = function (label, currentStatus) { return __awaiter(_this, void 0, void 0, function () {
        var newStatus, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newStatus = currentStatus === 'active' ? 'locked' : 'active';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/oracle/lock', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ label: label, status: newStatus })
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        toast({
                            title: "Success",
                            description: "Memory ".concat(newStatus === 'locked' ? 'locked' : 'unlocked', " successfully")
                        });
                        fetchMemories();
                    }
                    else {
                        toast({
                            title: "Error",
                            description: "Failed to update memory status",
                            variant: "destructive"
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    // Error toggling lock
                    toast({
                        title: "Error",
                        description: "Failed to update memory status",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleExport = function (label, format) { return __awaiter(_this, void 0, void 0, function () {
        var response, blob, url, a, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/oracle/export/".concat(label, "?format=").concat(format))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.blob()];
                case 2:
                    blob = _a.sent();
                    url = window.URL.createObjectURL(blob);
                    a = document.createElement('a');
                    a.href = url;
                    a.download = "".concat(label, ".").concat(format);
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    toast({
                        title: "Success",
                        description: "Memory exported as ".concat(format.toUpperCase())
                    });
                    return [3 /*break*/, 4];
                case 3:
                    toast({
                        title: "Error",
                        description: "Failed to export memory",
                        variant: "destructive"
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    // Error exporting memory
                    toast({
                        title: "Error",
                        description: "Failed to export memory",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var getTypeIcon = function (type) {
        var typeObj = memoryTypes.find(function (t) { return t.value === type; });
        return (typeObj === null || typeObj === void 0 ? void 0 : typeObj.icon) || <lucide_react_1.FileText className="w-4 h-4"/>;
    };
    var filteredMemories = memories.filter(function (memory) {
        if (statusFilter !== 'all' && memory.status !== statusFilter)
            return false;
        if (typeFilter !== 'all' && memory.memoryType !== typeFilter)
            return false;
        if (searchTerm && !memory.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !memory.description.toLowerCase().includes(searchTerm.toLowerCase()))
            return false;
        return true;
    });
    return (<div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-400 mb-2">Zebulon Oracle Database</h1>
            <p className="text-gray-400">Master memory hub for the Zebulon system</p>
          </div>
          <button_1.Button onClick={onClose} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Back to Dashboard
          </button_1.Button>
        </div>

        <tabs_1.Tabs defaultValue="memories" className="space-y-6">
          <tabs_1.TabsList className="bg-gray-900 border-gray-700">
            <tabs_1.TabsTrigger value="memories" className="data-[state=active]:bg-purple-600">Memory Bank</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="store" className="data-[state=active]:bg-purple-600">Store New</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value="memories" className="space-y-6">
            {/* Controls */}
            <card_1.Card className="bg-gray-900 border-gray-700">
              <card_1.CardHeader>
                <card_1.CardTitle className="text-purple-400">Memory Control Panel</card_1.CardTitle>
                <card_1.CardDescription>Search, filter, and manage Oracle memories</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label_1.Label htmlFor="search">Search Memories</label_1.Label>
                    <div className="relative">
                      <lucide_react_1.Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                      <input_1.Input id="search" placeholder="Search by label or description..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="pl-10 bg-gray-800 border-gray-600 text-white"/>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label_1.Label>Status Filter</label_1.Label>
                    <select_1.Select value={statusFilter} onValueChange={setStatusFilter}>
                      <select_1.SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent className="bg-gray-800 border-gray-600">
                        <select_1.SelectItem value="all">All Status</select_1.SelectItem>
                        <select_1.SelectItem value="active">Active Only</select_1.SelectItem>
                        <select_1.SelectItem value="locked">Locked Only</select_1.SelectItem>
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label_1.Label>Type Filter</label_1.Label>
                    <select_1.Select value={typeFilter} onValueChange={setTypeFilter}>
                      <select_1.SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent className="bg-gray-800 border-gray-600">
                        <select_1.SelectItem value="all">All Types</select_1.SelectItem>
                        {memoryTypes.map(function (type) { return (<select_1.SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </select_1.SelectItem>); })}
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* Memory Table */}
            <card_1.Card className="bg-gray-900 border-gray-700">
              <card_1.CardHeader>
                <card_1.CardTitle className="text-purple-400">Memory Bank ({filteredMemories.length} entries)</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                {loading ? (<div className="text-center py-8 text-gray-400">Loading memories...</div>) : filteredMemories.length === 0 ? (<div className="text-center py-8 text-gray-400">No memories found</div>) : (<table_1.Table>
                    <table_1.TableHeader>
                      <table_1.TableRow className="border-gray-700">
                        <table_1.TableHead className="text-purple-400">Label</table_1.TableHead>
                        <table_1.TableHead className="text-purple-400">Description</table_1.TableHead>
                        <table_1.TableHead className="text-purple-400">Type</table_1.TableHead>
                        <table_1.TableHead className="text-purple-400">Status</table_1.TableHead>
                        <table_1.TableHead className="text-purple-400">Last Modified</table_1.TableHead>
                        <table_1.TableHead className="text-purple-400">Actions</table_1.TableHead>
                      </table_1.TableRow>
                    </table_1.TableHeader>
                    <table_1.TableBody>
                      {filteredMemories.map(function (memory) { return (<table_1.TableRow key={memory.id} className="border-gray-700 hover:bg-gray-800">
                          <table_1.TableCell className="font-medium text-white">{memory.label}</table_1.TableCell>
                          <table_1.TableCell className="text-gray-300 max-w-xs truncate">
                            {memory.description}
                          </table_1.TableCell>
                          <table_1.TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(memory.memoryType)}
                              <span className="text-gray-300 capitalize">{memory.memoryType}</span>
                            </div>
                          </table_1.TableCell>
                          <table_1.TableCell>
                            <badge_1.Badge variant={memory.status === 'active' ? 'default' : 'secondary'}>
                              {memory.status === 'active' ? (<lucide_react_1.Unlock className="w-3 h-3 mr-1"/>) : (<lucide_react_1.Lock className="w-3 h-3 mr-1"/>)}
                              {memory.status}
                            </badge_1.Badge>
                          </table_1.TableCell>
                          <table_1.TableCell className="text-gray-300">
                            {new Date(memory.lastModified).toLocaleDateString()}
                          </table_1.TableCell>
                          <table_1.TableCell>
                            <div className="flex items-center gap-2">
                              <button_1.Button variant="ghost" size="sm" onClick={function () {
                    setSelectedMemory(memory);
                    setIsViewDialogOpen(true);
                }} className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                <lucide_react_1.Edit className="w-4 h-4"/>
                              </button_1.Button>
                              <button_1.Button variant="ghost" size="sm" onClick={function () { return handleToggleLock(memory.label, memory.status); }} className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                {memory.status === 'active' ? (<lucide_react_1.Lock className="w-4 h-4"/>) : (<lucide_react_1.Unlock className="w-4 h-4"/>)}
                              </button_1.Button>
                              <button_1.Button variant="ghost" size="sm" onClick={function () { return handleExport(memory.label, 'json'); }} className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                <lucide_react_1.Download className="w-4 h-4"/>
                              </button_1.Button>
                            </div>
                          </table_1.TableCell>
                        </table_1.TableRow>); })}
                    </table_1.TableBody>
                  </table_1.Table>)}
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="store" className="space-y-6">
            <card_1.Card className="bg-gray-900 border-gray-700">
              <card_1.CardHeader>
                <card_1.CardTitle className="text-purple-400">Store New Memory</card_1.CardTitle>
                <card_1.CardDescription>Create a new memory entry in the Oracle Database</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label_1.Label htmlFor="label">Memory Label *</label_1.Label>
                    <input_1.Input id="label" placeholder="unique_memory_label" value={newMemory.label} onChange={function (e) { return setNewMemory(function (prev) { return (__assign(__assign({}, prev), { label: e.target.value })); }); }} className="bg-gray-800 border-gray-600 text-white"/>
                  </div>
                  
                  <div className="space-y-2">
                    <label_1.Label>Memory Type *</label_1.Label>
                    <select_1.Select value={newMemory.memoryType} onValueChange={function (value) { return setNewMemory(function (prev) { return (__assign(__assign({}, prev), { memoryType: value })); }); }}>
                      <select_1.SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent className="bg-gray-800 border-gray-600">
                        {memoryTypes.map(function (type) { return (<select_1.SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              {type.icon}
                              {type.label}
                            </div>
                          </select_1.SelectItem>); })}
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label_1.Label htmlFor="description">Description *</label_1.Label>
                  <input_1.Input id="description" placeholder="Brief description of this memory..." value={newMemory.description} onChange={function (e) { return setNewMemory(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }} className="bg-gray-800 border-gray-600 text-white"/>
                </div>
                
                <div className="space-y-2">
                  <label_1.Label htmlFor="content">Memory Content *</label_1.Label>
                  <textarea_1.Textarea id="content" placeholder="Enter the memory content, logic, or data to store..." value={newMemory.content} onChange={function (e) { return setNewMemory(function (prev) { return (__assign(__assign({}, prev), { content: e.target.value })); }); }} className="bg-gray-800 border-gray-600 text-white min-h-32"/>
                </div>
                
                <button_1.Button onClick={handleStoreMemory} className="w-full bg-purple-600 hover:bg-purple-700">
                  <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                  Store Memory
                </button_1.Button>
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <card_1.Card className="bg-gray-900 border-gray-700">
                <card_1.CardHeader>
                  <card_1.CardTitle className="text-purple-400">Total Memories</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="text-3xl font-bold text-white">{memories.length}</div>
                  <p className="text-gray-400">Stored memories</p>
                </card_1.CardContent>
              </card_1.Card>
              
              <card_1.Card className="bg-gray-900 border-gray-700">
                <card_1.CardHeader>
                  <card_1.CardTitle className="text-purple-400">Active Memories</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    {memories.filter(function (m) { return m.status === 'active'; }).length}
                  </div>
                  <p className="text-gray-400">Unlocked entries</p>
                </card_1.CardContent>
              </card_1.Card>
              
              <card_1.Card className="bg-gray-900 border-gray-700">
                <card_1.CardHeader>
                  <card_1.CardTitle className="text-purple-400">Locked Memories</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="text-3xl font-bold text-red-400">
                    {memories.filter(function (m) { return m.status === 'locked'; }).length}
                  </div>
                  <p className="text-gray-400">Protected entries</p>
                </card_1.CardContent>
              </card_1.Card>
            </div>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>

        {/* View Memory Dialog */}
        <dialog_1.Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <dialog_1.DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle className="text-purple-400">Memory Details: {selectedMemory === null || selectedMemory === void 0 ? void 0 : selectedMemory.label}</dialog_1.DialogTitle>
              <dialog_1.DialogDescription className="text-gray-400">
                View and export memory content
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>
            {selectedMemory && (<div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label_1.Label className="text-purple-400">Type</label_1.Label>
                    <p className="text-white capitalize">{selectedMemory.memoryType}</p>
                  </div>
                  <div>
                    <label_1.Label className="text-purple-400">Status</label_1.Label>
                    <badge_1.Badge variant={selectedMemory.status === 'active' ? 'default' : 'secondary'}>
                      {selectedMemory.status}
                    </badge_1.Badge>
                  </div>
                </div>
                
                <div>
                  <label_1.Label className="text-purple-400">Description</label_1.Label>
                  <p className="text-white">{selectedMemory.description}</p>
                </div>
                
                <div>
                  <label_1.Label className="text-purple-400">Content</label_1.Label>
                  <textarea_1.Textarea value={selectedMemory.content} readOnly className="bg-gray-800 border-gray-600 text-white min-h-48"/>
                </div>
                
                <div className="flex gap-2">
                  <button_1.Button onClick={function () { return handleExport(selectedMemory.label, 'json'); }} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <lucide_react_1.Download className="w-4 h-4 mr-2"/>
                    Export JSON
                  </button_1.Button>
                  <button_1.Button onClick={function () { return handleExport(selectedMemory.label, 'txt'); }} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <lucide_react_1.Download className="w-4 h-4 mr-2"/>
                    Export TXT
                  </button_1.Button>
                </div>
              </div>)}
          </dialog_1.DialogContent>
        </dialog_1.Dialog>
      </div>
    </div>);
}
