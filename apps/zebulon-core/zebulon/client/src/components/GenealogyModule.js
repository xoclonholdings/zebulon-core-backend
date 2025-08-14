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
exports.default = GenealogyModule;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var use_toast_1 = require("@/hooks/use-toast");
function GenealogyModule(_a) {
    var _this = this;
    var onBack = _a.onBack;
    var _b = (0, react_1.useState)([]), familyTrees = _b[0], setFamilyTrees = _b[1];
    var _c = (0, react_1.useState)(false), uploading = _c[0], setUploading = _c[1];
    var _d = (0, react_1.useState)(null), selectedTree = _d[0], setSelectedTree = _d[1];
    var _e = (0, react_1.useState)(true), loading = _e[0], setLoading = _e[1];
    var toast = (0, use_toast_1.useToast)().toast;
    (0, react_1.useEffect)(function () {
        fetchFamilyTrees();
    }, []);
    var fetchFamilyTrees = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, trees, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    return [4 /*yield*/, fetch('/api/gedcom/trees')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    trees = _a.sent();
                    setFamilyTrees(trees);
                    return [3 /*break*/, 4];
                case 3:
                    toast({
                        title: "Error",
                        description: "Failed to load family trees",
                        variant: "destructive"
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error fetching family trees:', error_1);
                    toast({
                        title: "Error",
                        description: "Failed to load family trees",
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
    var handleFileUpload = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var file, formData, response, result, error, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file)
                        return [2 /*return*/];
                    if (!file.name.toLowerCase().endsWith('.ged') && !file.name.toLowerCase().endsWith('.gedcom')) {
                        toast({
                            title: "Invalid File",
                            description: "Please upload a GEDCOM (.ged) file",
                            variant: "destructive"
                        });
                        return [2 /*return*/];
                    }
                    setUploading(true);
                    formData = new FormData();
                    formData.append('gedcom', file);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, fetch('/api/gedcom/upload', {
                            method: 'POST',
                            body: formData
                        })];
                case 2:
                    response = _b.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _b.sent();
                    toast({
                        title: "Upload Successful",
                        description: "".concat(result.filename, " uploaded with ").concat(result.summary.individuals, " individuals and ").concat(result.summary.families, " families")
                    });
                    fetchFamilyTrees();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    error = _b.sent();
                    toast({
                        title: "Upload Failed",
                        description: error.error || "Failed to upload GEDCOM file",
                        variant: "destructive"
                    });
                    _b.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    error_2 = _b.sent();
                    console.error('Upload error:', error_2);
                    toast({
                        title: "Upload Failed",
                        description: "Failed to upload GEDCOM file",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 9];
                case 8:
                    setUploading(false);
                    // Reset the input
                    event.target.value = '';
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var loadTreeData = function (treeId) { return __awaiter(_this, void 0, void 0, function () {
        var response, tree, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/gedcom/tree/".concat(treeId))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    tree = _a.sent();
                    setSelectedTree(tree);
                    return [3 /*break*/, 4];
                case 3:
                    toast({
                        title: "Error",
                        description: "Failed to load family tree data",
                        variant: "destructive"
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error('Error loading tree data:', error_3);
                    toast({
                        title: "Error",
                        description: "Failed to load family tree data",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var deleteTree = function (treeId) { return __awaiter(_this, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this family tree?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/gedcom/tree/".concat(treeId), {
                            method: 'DELETE'
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        toast({
                            title: "Deleted",
                            description: "Family tree deleted successfully"
                        });
                        fetchFamilyTrees();
                        if ((selectedTree === null || selectedTree === void 0 ? void 0 : selectedTree.id) === treeId) {
                            setSelectedTree(null);
                        }
                    }
                    else {
                        toast({
                            title: "Error",
                            description: "Failed to delete family tree",
                            variant: "destructive"
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('Delete error:', error_4);
                    toast({
                        title: "Error",
                        description: "Failed to delete family tree",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var exportTree = function (tree, format) {
        if (format === void 0) { format = 'json'; }
        var data = format === 'json' ? JSON.stringify(tree.data, null, 2) :
            "Family Tree: ".concat(tree.filename, "\nUploaded: ").concat(tree.uploadedAt, "\n\nData:\n").concat(JSON.stringify(tree.data, null, 2));
        var blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "".concat(tree.filename.replace('.ged', ''), ".").concat(format);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    if (selectedTree) {
        var individuals = selectedTree.data.filter(function (item) { return item.tag === 'INDI'; });
        var families = selectedTree.data.filter(function (item) { return item.tag === 'FAM'; });
        return (<div className="min-h-screen p-8" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button_1.Button onClick={function () { return setSelectedTree(null); }} variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Trees
              </button_1.Button>
              <h1 className="text-3xl font-bold text-white">{selectedTree.filename}</h1>
            </div>
            <div className="flex space-x-2">
              <button_1.Button onClick={function () { return exportTree(selectedTree, 'json'); }} variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                <lucide_react_1.Download className="h-4 w-4 mr-2"/>
                Export JSON
              </button_1.Button>
              <button_1.Button onClick={function () { return exportTree(selectedTree, 'txt'); }} variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                <lucide_react_1.Download className="h-4 w-4 mr-2"/>
                Export TXT
              </button_1.Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <card_1.Card className="bg-gray-900 border-gray-800">
              <card_1.CardHeader className="pb-3">
                <card_1.CardTitle className="text-white flex items-center">
                  <lucide_react_1.Users className="h-5 w-5 mr-2 text-blue-400"/>
                  Individuals
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold text-blue-400">{individuals.length}</div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card className="bg-gray-900 border-gray-800">
              <card_1.CardHeader className="pb-3">
                <card_1.CardTitle className="text-white flex items-center">
                  <lucide_react_1.FolderTree className="h-5 w-5 mr-2 text-green-400"/>
                  Families
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold text-green-400">{families.length}</div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card className="bg-gray-900 border-gray-800">
              <card_1.CardHeader className="pb-3">
                <card_1.CardTitle className="text-white flex items-center">
                  <lucide_react_1.Calendar className="h-5 w-5 mr-2 text-purple-400"/>
                  Uploaded
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-sm text-gray-400">
                  {new Date(selectedTree.uploadedAt).toLocaleDateString()}
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>

          {/* Sample individuals display */}
          <card_1.Card className="bg-gray-900 border-gray-800">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-white">Sample Individuals</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {individuals.slice(0, 10).map(function (individual, index) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                var name = ((_b = (_a = individual.data) === null || _a === void 0 ? void 0 : _a.find(function (d) { return d.tag === 'NAME'; })) === null || _b === void 0 ? void 0 : _b.data) || 'Unknown';
                var birth = ((_h = (_g = (_f = (_e = (_d = (_c = individual.data) === null || _c === void 0 ? void 0 : _c.find(function (d) { return d.tag === 'BIRT'; })) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.find(function (bd) { return bd.tag === 'DATE'; })) === null || _h === void 0 ? void 0 : _h.data) || 'Unknown';
                return (<div key={index} className="p-3 bg-gray-800 rounded border border-gray-700">
                      <div className="text-white font-medium">{name}</div>
                      <div className="text-gray-400 text-sm">Born: {birth}</div>
                      <div className="text-gray-500 text-xs">ID: {((_k = (_j = individual.data) === null || _j === void 0 ? void 0 : _j.find(function (d) { return d.tag === 'XREF'; })) === null || _k === void 0 ? void 0 : _k.data) || individual.pointer}</div>
                    </div>);
            })}
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>);
    }
    return (<div className="min-h-screen p-8" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button_1.Button onClick={onBack} variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/>
              Back to Dashboard
            </button_1.Button>
            <h1 className="text-3xl font-bold text-white">Legacy Archive</h1>
          </div>
        </div>

        {/* Upload Section */}
        <card_1.Card className="bg-gray-900 border-gray-800 mb-8">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-white flex items-center">
              <lucide_react_1.Upload className="h-5 w-5 mr-2 text-purple-400"/>
              Upload GEDCOM File
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <p className="text-gray-400">
                Upload a GEDCOM (.ged) file to import your family tree data. Supported formats include standard GEDCOM files from most genealogy software.
              </p>
              <div className="flex items-center space-x-4">
                <input type="file" accept=".ged,.gedcom" onChange={handleFileUpload} disabled={uploading} className="flex-1 text-white bg-gray-800 border border-gray-700 rounded px-3 py-2"/>
                {uploading && (<div className="text-purple-400">Uploading...</div>)}
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Family Trees List */}
        <card_1.Card className="bg-gray-900 border-gray-800">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-white flex items-center">
              <lucide_react_1.FolderTree className="h-5 w-5 mr-2 text-green-400"/>
              Your Family Trees
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            {loading ? (<div className="text-gray-400">Loading family trees...</div>) : familyTrees.length === 0 ? (<div className="text-gray-400">No family trees uploaded yet. Upload a GEDCOM file to get started.</div>) : (<div className="space-y-3">
                {familyTrees.map(function (tree) { return (<div key={tree.id} className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700">
                    <div className="flex-1">
                      <div className="text-white font-medium">{tree.filename}</div>
                      <div className="text-gray-400 text-sm">
                        Uploaded: {new Date(tree.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button_1.Button onClick={function () { return loadTreeData(tree.id); }} variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                        View
                      </button_1.Button>
                      <button_1.Button onClick={function () { return deleteTree(tree.id); }} variant="outline" size="sm" className="bg-red-800 border-red-700 text-white hover:bg-red-700">
                        <lucide_react_1.Trash2 className="h-4 w-4"/>
                      </button_1.Button>
                    </div>
                  </div>); })}
              </div>)}
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
}
