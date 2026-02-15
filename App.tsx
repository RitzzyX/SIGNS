
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Home, 
  MapPin, 
  MessageSquare, 
  Sparkles, 
  BarChart3, 
  Phone,
  BedDouble,
  Bath,
  Maximize2,
  ChevronRight
} from 'lucide-react';
import { PROPERTIES, MARKET_TRENDS } from './data';
import { Property, ChatMessage } from './types';
import { GeminiService } from './services/gemini';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const gemini = new GeminiService();

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'analytics' | 'visualizer'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to Signature Spaces. How may I assist your real estate journey today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Visualizer State
  const [vizPrompt, setVizPrompt] = useState('');
  const [vizImage, setVizImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredProperties = PROPERTIES.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsTyping(true);

    try {
      const history = chatMessages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      const reply = await gemini.chatWithConcierge(history, userInput);
      setChatMessages([...newMessages, { role: 'model', text: reply || 'I apologize, I am having trouble connecting right now.' }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVisualize = async () => {
    if (!vizPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await gemini.visualizeSpace(vizPrompt);
      if (result) setVizImage(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black flex items-center justify-center rounded-lg">
                <Home className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight serif">Signature Spaces</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setActiveTab('listings')} className={`text-sm font-medium transition-colors ${activeTab === 'listings' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Listings</button>
              <button onClick={() => setActiveTab('analytics')} className={`text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Market Insights</button>
              <button onClick={() => setActiveTab('visualizer')} className={`flex items-center gap-1 text-sm font-medium transition-colors ${activeTab === 'visualizer' ? 'text-black' : 'text-gray-500 hover:text-black'}`}><Sparkles className="w-4 h-4" /> AI Visualizer</button>
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all">List Your Space</button>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-6 flex flex-col gap-4">
          <button onClick={() => {setActiveTab('listings'); setIsMenuOpen(false);}} className="text-lg font-medium">Listings</button>
          <button onClick={() => {setActiveTab('analytics'); setIsMenuOpen(false);}} className="text-lg font-medium">Market Insights</button>
          <button onClick={() => {setActiveTab('visualizer'); setIsMenuOpen(false);}} className="text-lg font-medium">AI Visualizer</button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {activeTab === 'listings' && (
          <div className="animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
                className="absolute inset-0 w-full h-full object-cover scale-105"
                alt="Luxury Home"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl text-white font-bold mb-6 serif">Find Your Signature Lifestyle.</h1>
                <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">Discover an curated collection of the world's most exceptional properties.</p>
                
                <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
                  <div className="flex-grow flex items-center px-4 gap-3">
                    <Search className="text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search location, lifestyle, or property name..."
                      className="w-full h-12 outline-none text-gray-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all">Search</button>
                </div>
              </div>
            </div>

            {/* Property Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl font-bold mb-2 serif">Featured Collections</h2>
                  <p className="text-gray-500">Hand-picked estates from our global network.</p>
                </div>
                <button className="text-black font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <div 
                    key={property.id} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="relative h-72 overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                        {property.type}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{property.title}</h3>
                        <span className="text-lg font-bold text-black">{formatCurrency(property.price)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                        <MapPin className="w-4 h-4" /> {property.location}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-sm font-medium text-gray-600"><BedDouble className="w-4 h-4" /> {property.beds}</span>
                          <span className="flex items-center gap-1 text-sm font-medium text-gray-600"><Bath className="w-4 h-4" /> {property.baths}</span>
                          <span className="flex items-center gap-1 text-sm font-medium text-gray-600"><Maximize2 className="w-4 h-4" /> {property.sqft.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-500">
            <h2 className="text-4xl font-bold mb-8 serif">Market Intelligence</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> Average Listing Price Trend
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MARKET_TRENDS}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip />
                      <Area type="monotone" dataKey="averagePrice" stroke="#000" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-black text-white p-8 rounded-3xl">
                  <h4 className="text-lg font-semibold mb-2">Market Pulse</h4>
                  <p className="text-white/70 text-sm mb-6">Inventory is currently low, favoring sellers. Luxury demand remains resilient with a 12% YOY growth in coastal regions.</p>
                  <div className="flex items-center justify-between border-t border-white/20 pt-4">
                    <div>
                      <p className="text-xs text-white/50">Avg Days on Market</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Sell to List Ratio</p>
                      <p className="text-2xl font-bold">102%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h4 className="text-lg font-bold mb-4">Investor Insights</h4>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-sm">
                      <span className="w-5 h-5 bg-green-100 text-green-700 rounded flex items-center justify-center font-bold">↑</span>
                      <div>
                        <p className="font-semibold">Short-term rentals</p>
                        <p className="text-gray-500">Yields up 8% in resort areas.</p>
                      </div>
                    </li>
                    <li className="flex gap-3 text-sm">
                      <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded flex items-center justify-center font-bold">→</span>
                      <div>
                        <p className="font-semibold">Urban Luxury</p>
                        <p className="text-gray-500">Stabilizing prices in metro hubs.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-500">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 serif">AI Interior Design Visualizer</h2>
              <p className="text-gray-500">Describe your dream space and let our generative engine bring it to life.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
              <div className="mb-8">
                <div className="relative aspect-video bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
                  {vizImage ? (
                    <img src={vizImage} className="w-full h-full object-cover animate-in zoom-in-95 duration-700" alt="Generated visual" />
                  ) : (
                    <div className="text-center p-12">
                      <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-400">Your vision will appear here</p>
                    </div>
                  )}
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        <p className="text-black font-medium">Generating your signature space...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="E.g., A minimalist master bedroom with walnut accents and floor-to-ceiling windows..."
                  className="flex-grow h-14 px-6 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  value={vizPrompt}
                  onChange={(e) => setVizPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVisualize()}
                />
                <button 
                  onClick={handleVisualize}
                  disabled={isGenerating || !vizPrompt.trim()}
                  className="bg-black text-white px-10 rounded-xl font-bold h-14 hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" /> Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-500">
            <div className="relative h-96">
              <img src={selectedProperty.image} className="w-full h-full object-cover" alt={selectedProperty.title} />
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40 transition-all text-white"
              >
                <X />
              </button>
            </div>
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                <div>
                  <h2 className="text-4xl font-bold serif mb-2">{selectedProperty.title}</h2>
                  <p className="text-xl text-gray-500 flex items-center gap-2"><MapPin className="w-5 h-5" /> {selectedProperty.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-black">{formatCurrency(selectedProperty.price)}</p>
                  <p className="text-gray-400">Estimated Mortgage: $18,450/mo</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-sm text-gray-500 mb-1">Bedrooms</p>
                  <p className="text-xl font-bold">{selectedProperty.beds}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-sm text-gray-500 mb-1">Bathrooms</p>
                  <p className="text-xl font-bold">{selectedProperty.baths}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-sm text-gray-500 mb-1">Square Feet</p>
                  <p className="text-xl font-bold">{selectedProperty.sqft.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-sm text-gray-500 mb-1">Year Built</p>
                  <p className="text-xl font-bold">2023</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-bold mb-4 serif">Description</h3>
                  <p className="text-gray-600 leading-relaxed mb-8">{selectedProperty.description}</p>
                  
                  <h3 className="text-2xl font-bold mb-4 serif">Amenities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProperty.amenities.map(item => (
                      <div key={item} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-black rounded-full" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 sticky top-4">
                    <h3 className="text-xl font-bold mb-6">Contact Agent</h3>
                    <div className="flex items-center gap-4 mb-8">
                      <img src="https://picsum.photos/100/100" className="w-16 h-16 rounded-2xl object-cover" alt="Agent" />
                      <div>
                        <p className="font-bold">Julian Vane</p>
                        <p className="text-sm text-gray-500">Luxury Portfolio Director</p>
                      </div>
                    </div>
                    <button className="w-full bg-black text-white py-4 rounded-xl font-bold mb-3 hover:bg-gray-800 transition-all">Inquire Now</button>
                    <button className="w-full border border-gray-200 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all">
                      <Phone className="w-4 h-4" /> Call Agent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      <div className={`fixed bottom-8 right-8 z-[200] flex flex-col items-end gap-4`}>
        {isChatOpen && (
          <div className="bg-white w-[350px] md:w-[400px] h-[550px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-black p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold leading-none">Signature Concierge</h4>
                  <span className="text-white/50 text-xs">AI Powered Real Estate Advisor</span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:rotate-90 transition-transform">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-black text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask about properties or trends..."
                  className="w-full bg-gray-50 h-12 pl-4 pr-12 rounded-xl border-none outline-none focus:ring-2 focus:ring-black/5"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1.5 w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isChatOpen ? 'bg-black rotate-90' : 'bg-black hover:scale-110'}`}
        >
          {isChatOpen ? <X className="text-white w-6 h-6" /> : <MessageSquare className="text-white w-6 h-6" />}
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-white flex items-center justify-center rounded">
                  <Home className="text-black w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight serif">Signature Spaces</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">Defining luxury real estate through architectural excellence and unparalleled service.</p>
            </div>
            <div>
              <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-white/40">Explore</h5>
              <ul className="space-y-4 text-sm text-white/70">
                <li className="hover:text-white transition-colors cursor-pointer">Luxury Homes</li>
                <li className="hover:text-white transition-colors cursor-pointer">Penthouse Living</li>
                <li className="hover:text-white transition-colors cursor-pointer">Private Islands</li>
                <li className="hover:text-white transition-colors cursor-pointer">Commercial Assets</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-white/40">Company</h5>
              <ul className="space-y-4 text-sm text-white/70">
                <li className="hover:text-white transition-colors cursor-pointer">Our Story</li>
                <li className="hover:text-white transition-colors cursor-pointer">The Team</li>
                <li className="hover:text-white transition-colors cursor-pointer">Global Reach</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-white/40">Join Our Circle</h5>
              <p className="text-sm text-white/60 mb-4">Receive curated property listings directly in your inbox.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email Address" className="bg-white/10 border-none rounded-lg px-4 flex-grow text-sm outline-none focus:ring-1 focus:ring-white/20" />
                <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold">Join</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/10 text-xs text-white/30 uppercase tracking-widest">
            <p>&copy; 2024 Signature Spaces. All Rights Reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
