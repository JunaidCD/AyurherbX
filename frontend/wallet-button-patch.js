// This script will add the Connect Wallet button to the LabTest header
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'LabTest', 'LabTest.jsx');

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Find the header closing tags and replace with Connect Wallet button
const oldHeaderEnd = `            </div>
          </div>`;

const newHeaderEnd = `            </div>
            
            {/* Connect Wallet Button */}
            <div className="flex items-center gap-4">
              {walletAddress ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-300 text-sm font-medium">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl text-red-300 hover:text-red-200 transition-all duration-200 text-sm font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 hover:from-blue-500/30 hover:to-emerald-500/30 border border-blue-500/30 hover:border-emerald-500/50 rounded-xl text-white font-semibold transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      Connect Wallet
                    </>
                  )}
                </button>
              )}
            </div>
          </div>`;

// Replace the content
content = content.replace(oldHeaderEnd, newHeaderEnd);

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Connect Wallet button added successfully!');
