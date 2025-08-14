"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Landing;
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
var fantasma_firewall_logo_svg_1 = require("@assets/fantasma-firewall-logo.svg");
function Landing() {
    return (<div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-navy-600 bg-navy-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={fantasma_firewall_logo_svg_1.default} alt="Fantasma Firewall" className="w-10 h-10"/>
              <div>
                <h1 className="text-xl font-bold text-white">Fantasma Firewall</h1>
                <p className="text-xs text-slate-400">AI Security Operations Center</p>
              </div>
            </div>
            
            <button_1.Button onClick={function () { return window.location.href = '/api/login'; }} className="bg-cyber-green hover:bg-cyber-green/80 text-navy-900 font-semibold">
              Secure Login
            </button_1.Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Enterprise
            <span className="block text-cyber-green">Security Operations</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Advanced security operations center with AI-powered threat detection, 
            real-time monitoring, and comprehensive encryption layers.
          </p>
          <div className="space-y-4">
            <button_1.Button onClick={function () { return window.location.href = '/api/login'; }} size="lg" className="bg-cyber-green hover:bg-cyber-green/80 text-navy-900 font-bold text-lg px-8 py-4 shadow-lg hover:shadow-cyber-green/20 transition-all duration-300">
              <lucide_react_1.Shield className="w-5 h-5 mr-2"/>
              Access Security Operations Center
            </button_1.Button>
            <p className="text-sm text-slate-400">
              Secure authentication powered by Replit OAuth
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <card_1.Card className="bg-navy-800 border-navy-600 hover:border-cyber-green/50 transition-colors">
            <card_1.CardHeader>
              <lucide_react_1.Brain className="w-8 h-8 text-purple-400 mb-2"/>
              <card_1.CardTitle className="text-white">Zeta Core AI</card_1.CardTitle>
              <card_1.CardDescription className="text-slate-400">
                AI security engine with advanced threat analysis
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <p className="text-slate-300 text-sm">
                Advanced pattern analysis and threat detection with machine learning algorithms for security monitoring.
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="bg-navy-800 border-navy-600 hover:border-cyber-green/50 transition-colors">
            <card_1.CardHeader>
              <lucide_react_1.Lock className="w-8 h-8 cyber-green mb-2"/>
              <card_1.CardTitle className="text-white">Quantum Encryption</card_1.CardTitle>
              <card_1.CardDescription className="text-slate-400">
                Multi-layer encryption system
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <p className="text-slate-300 text-sm">
                Multi-layer encryption across Physical, Network, Transport, and Application levels with enterprise-grade security.
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="bg-navy-800 border-navy-600 hover:border-cyber-green/50 transition-colors">
            <card_1.CardHeader>
              <lucide_react_1.Zap className="w-8 h-8 cyber-blue mb-2"/>
              <card_1.CardTitle className="text-white">ZEBULON Web3 Interface</card_1.CardTitle>
              <card_1.CardDescription className="text-slate-400">
                Unified Web3 platform
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <p className="text-slate-300 text-sm">
                Complete Web3 interface integrating ZWAP exchange, Zeta Core AI, and Zinc infrastructure under unified security.
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="bg-navy-800 border-navy-600 hover:border-cyber-green/50 transition-colors">
            <card_1.CardHeader>
              <lucide_react_1.Shield className="w-8 h-8 text-orange-400 mb-2"/>
              <card_1.CardTitle className="text-white">Advanced Threat Detection</card_1.CardTitle>
              <card_1.CardDescription className="text-slate-400">
                Sophisticated security monitoring
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <p className="text-slate-300 text-sm">
                Real-time monitoring for unauthorized access attempts, suspicious activity patterns, and security breaches.
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="bg-navy-800 border-navy-600 hover:border-cyber-green/50 transition-colors">
            <card_1.CardHeader>
              <lucide_react_1.Users className="w-8 h-8 text-red-400 mb-2"/>
              <card_1.CardTitle className="text-white">Security Response</card_1.CardTitle>
              <card_1.CardDescription className="text-slate-400">
                Automated threat mitigation
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <p className="text-slate-300 text-sm">
                Intelligent response systems and isolation protocols to handle security incidents automatically.
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="bg-navy-800 border-navy-600 hover:border-cyber-green/50 transition-colors">
            <card_1.CardHeader>
              <lucide_react_1.Activity className="w-8 h-8 cyber-blue mb-2"/>
              <card_1.CardTitle className="text-white">Real-time Monitoring</card_1.CardTitle>
              <card_1.CardDescription className="text-slate-400">
                Live security operations dashboard
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <p className="text-slate-300 text-sm">
                WebSocket-powered live updates with comprehensive system metrics and threat analytics.
              </p>
            </card_1.CardContent>
          </card_1.Card>
        </div>

        {/* Integration Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-6">System Integration</h3>
          <p className="text-lg text-slate-300 mb-8">
            Native integration with ZEBULON Web3 Interface and its integrated components.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-navy-800 border border-navy-600 rounded-lg px-6 py-3">
              <span className="text-cyber-green font-semibold">ZEBULON</span>
            </div>
            <div className="bg-navy-800 border border-navy-600 rounded-lg px-6 py-3">
              <span className="text-cyber-blue font-semibold">ZWAP!</span>
            </div>
            <div className="bg-navy-800 border border-navy-600 rounded-lg px-6 py-3">
              <span className="text-purple-400 font-semibold">Zeta Core</span>
            </div>
            <div className="bg-navy-800 border border-navy-600 rounded-lg px-6 py-3">
              <span className="text-orange-400 font-semibold">Zinc</span>
            </div>
          </div>
        </div>
      </main>
    </div>);
}
