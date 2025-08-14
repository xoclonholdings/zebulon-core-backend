"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Removed: Non-Zebulon page
var react_1 = require("react");
var wouter_1 = require("wouter");
var appLinks_1 = require("@/config/appLinks");
var AppPage = function () {
    var location = (0, wouter_1.useLocation)()[0];
    // Expecting route: /app/:id
    var match = location.match(/^\/app\/([^/]+)/);
    var appId = match ? match[1] : "";
    var external = appLinks_1.APP_LINKS[appId];
    return (<div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-full flex justify-end p-4">
        {(external === null || external === void 0 ? void 0 : external.externalUrl) && (<a href={external.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded" aria-label={external.externalLabel}>
            {external.externalLabel}
          </a>)}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">{appId === null || appId === void 0 ? void 0 : appId.toUpperCase()} App</h1>
        {/* TODO: Render the actual app UI here, e.g. <ZedChat /> for zed, etc. */}
        <div className="text-gray-400">Integrated {appId} UI goes here.</div>
      </div>
    </div>);
};
exports.default = AppPage;
