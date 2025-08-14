"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wouter_1 = require("wouter");
var appLinks_1 = require("@/config/appLinks");
var AppPage = function () {
    var _a = (0, wouter_1.useRoute)("/app/:id"), match = _a[0], params = _a[1];
    var appId = (params === null || params === void 0 ? void 0 : params.id) || "";
    var external = appLinks_1.APP_LINKS[appId];
    // ...existing code...
    var renderAppUI = function () {
        switch (appId) {
            case "zed":
                return <div className="text-gray-400">Integrated ZED UI goes here.</div>;
            // ZETA UI removed
            case "zlab":
                return <div className="text-gray-400">Integrated ZLAB UI goes here.</div>;
            case "zwap":
                return <div className="text-gray-400">Integrated ZWAP UI goes here.</div>;
            case "zync":
                return <div className="text-gray-400">Integrated ZYNC UI goes here.</div>;
            case "zulu":
                return <div className="text-gray-400">Integrated ZULU UI goes here.</div>;
            default:
                return <div className="text-gray-400">Unknown app: {appId}</div>;
        }
    };
    return (<div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-full flex justify-end p-4">
        {(external === null || external === void 0 ? void 0 : external.externalUrl) && (<a href={external.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded" aria-label={external.externalLabel}>
            {external.externalLabel}
          </a>)}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">{appId === null || appId === void 0 ? void 0 : appId.toUpperCase()} App</h1>
        {renderAppUI()}
      </div>
    </div>);
};
exports.default = AppPage;
