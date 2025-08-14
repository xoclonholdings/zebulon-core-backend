"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var queryClient_1 = require("./lib/queryClient");
var react_query_1 = require("@tanstack/react-query");
var toaster_1 = require("@/components/ui/toaster");
var AuthContext_1 = require("@/context/AuthContext");
var dashboard_1 = require("@/pages/dashboard");
var not_found_1 = require("@/pages/not-found");
var AppPage_1 = require("@/components/AppPage");
function AppRoutes() {
    return (<react_router_dom_1.BrowserRouter>
      <div className="mobile-viewport mobile-container bg-black overflow-hidden">
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<dashboard_1.default />}/>
          <react_router_dom_1.Route path="/app/:id" element={<AppPage_1.default />}/>
          <react_router_dom_1.Route path="*" element={<not_found_1.default />}/>
        </react_router_dom_1.Routes>
      </div>
    </react_router_dom_1.BrowserRouter>);
}
function App() {
    return (<react_query_1.QueryClientProvider client={queryClient_1.queryClient}>
      <>
        <toaster_1.Toaster />
        <AuthContext_1.AuthProvider>
          <AppRoutes />
        </AuthContext_1.AuthProvider>
      </>
    </react_query_1.QueryClientProvider>);
}
exports.default = App;
