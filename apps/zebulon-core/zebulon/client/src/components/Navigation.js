"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navigation;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var IMG_2227_1753477194826_png_1 = require("@assets/IMG_2227_1753477194826.png");
var wouter_1 = require("wouter");
function Navigation() {
    var _a = (0, react_1.useState)(false), isOpen = _a[0], setIsOpen = _a[1];
    var location = (0, wouter_1.useLocation)()[0];
    var navItems = [
        { path: "/", label: "Chat", icon: lucide_react_1.MessageSquare },
    ];
    return (<>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button_1.Button variant="ghost" size="sm" onClick={function () { return setIsOpen(!isOpen); }} className="w-10 h-10 p-0 zed-button rounded-xl">
          {isOpen ? <lucide_react_1.X size={20}/> : <lucide_react_1.Menu size={20}/>}
        </button_1.Button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (<div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={function () { return setIsOpen(false); }}/>)}

      {/* Navigation Sidebar */}
      <div className={"\n        fixed left-0 top-0 h-full w-64 zed-sidebar z-50 transform transition-transform duration-300\n        ".concat(isOpen ? 'translate-x-0' : '-translate-x-full', "\n        md:translate-x-0 md:static md:block\n      ")}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div>
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <img src={IMG_2227_1753477194826_png_1.default} alt="Z" className="w-5 h-5"/>
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">ZED</span>
              </h2>
              <p className="text-xs text-muted-foreground">AI Assistant</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map(function (item) {
            var isActive = location === item.path ||
                (item.path === "/" && location.startsWith("/chat"));
            var Icon = item.icon;
            return (<wouter_1.Link key={item.path} href={item.path}>
                  <button_1.Button variant="ghost" className={"\n                      w-full justify-start space-x-3 h-12 text-left zed-button\n                      ".concat(isActive
                    ? 'zed-glass border-purple-500/50 shadow-lg shadow-purple-500/20 text-purple-400'
                    : 'text-muted-foreground hover:text-foreground', "\n                    ")} onClick={function () { return setIsOpen(false); }}>
                    <Icon size={20}/>
                    <span>{item.label}</span>
                  </button_1.Button>
                </wouter_1.Link>);
        })}
          </nav>
        </div>
      </div>
    </>);
}
