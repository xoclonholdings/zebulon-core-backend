"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ZedLiteWelcome = function (_a) {
    var onSetup = _a.onSetup;
    return (<div style={{ background: '#222', color: '#fff', padding: 32, borderRadius: 16, textAlign: 'center' }}>
    <h2>Zed Lite Chatbot</h2>
    <p>This is a placeholder for the Zed Lite onboarding/setup flow.</p>
    {onSetup && <button style={{ marginTop: 16 }} onClick={onSetup}>Start Setup</button>}
  </div>);
};
exports.default = ZedLiteWelcome;
