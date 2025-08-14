"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZebulonCoreButton = ZebulonCoreButton;
var react_1 = require("react");
function ZebulonCoreButton(_a) {
    var onOpen = _a.onOpen;
    return (<button onClick={onOpen} style={{ padding: '8px 16px', background: '#6c47ff', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
      Zebulon Core
    </button>);
}
