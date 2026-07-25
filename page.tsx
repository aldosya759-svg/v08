'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AccountOverview } from '@/components/AccountOverview';
import { PinAuthModal } from '@/components/PinAuthModal';
import { TransferModal } from '@/components/TransferModal';
import { TransactionHistory } from '@/components/TransactionHistory';
import { ReceiptModal } from '@/components/ReceiptModal';
import { CyberMatrixBackground } from '@/components/CyberMatrixBackground';
import { INITIAL_ACCOUNT } from '@/lib/banking-store';
import { BankAccount, Transaction } from '@/types/banking';
import { Cpu } from 'lucide-react';

export default function BankingApp() {
  // App state
  const [account, setAccount] = useState<BankAccount>(INITIAL_ACCOUNT);
  // Start transactions empty so only NEW transactions after Swift are displayed
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // UI states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showBalance, setShowBalance] = useState<boolean>(true);

  // Modals state
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // Handle successful PIN Auth
  const handlePinSuccess = () => {
    setIsAuthenticated(true);
  };

  // Lock application back to PIN screen
  const handleLockApp = () => {
    setIsAuthenticated(false);
  };

  // Execute Transfer Target Swift
  const handleExecuteTransfer = (
    trxData: Omit<Transaction, 'id' | 'date' | 'time' | 'status' | 'referenceNumber'>,
    pinCode: string
  ): boolean => {
    const refNo = 'MDR' + Date.now().toString().slice(-10);
    const newTrx: Transaction = {
      ...trxData,
      id: 'TRX-' + Math.floor(1000000 + Math.random() * 9000000),
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      referenceNumber: refNo,
      status: 'SUCCESS',
    };

    // Update account balance
    setAccount((prev) => ({
      ...prev,
      balance: prev.balance - trxData.amount,
    }));

    // Prepend to transactions list so it appears under Progres Swift On Target
    setTransactions((prev) => [newTrx, ...prev]);

    return true;
  };

  return (
    <div className="relative min-h-screen bg-[#02060c] text-white font-mono antialiased selection:bg-[#00FF66] selection:text-[#002211] overflow-x-hidden">
      
      {/* Cyber Matrix Background with running coding numbers */}
      <CyberMatrixBackground opacity={0.4} />

      {/* PIN Gate Security Overlay */}
      <PinAuthModal
        isOpen={!isAuthenticated}
        onSuccess={handlePinSuccess}
        targetEmail={account.targetEmail}
        accountName={account.accountHolder}
      />

      {/* Navigation Header */}
      <Navbar
        account={account}
        showBalance={showBalance}
        setShowBalance={setShowBalance}
        onLock={handleLockApp}
      />

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10 font-mono">
        
        {/* Account Overview Hero Banner */}
        <AccountOverview
          account={account}
          showBalance={showBalance}
          onOpenTransfer={() => setIsTransferOpen(true)}
        />

        {/* Progres Swift On Target Section */}
        <TransactionHistory
          transactions={transactions}
          onOpenReceipt={(trx) => setSelectedReceipt(trx)}
        />

      </main>

      {/* Footer */}
      <footer className="bg-[#020914]/90 backdrop-blur-2xl text-white/60 py-10 border-t-2 border-[#00FF66]/30 mt-16 relative z-10 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00FF66] text-[#002211] font-black text-lg rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,102,0.4)]">
              <Cpu className="w-5 h-5 text-[#002211]" />
            </div>
            <div>
              <p className="font-extrabold text-[#00FF66] text-sm uppercase font-mono">venom08 Protocol</p>
              <p className="text-cyan-300/70 font-mono">Target Swift Network Gateway • . under.backround.system</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/60 font-mono">
            <span>System: <strong className="text-[#00FF66]">venomsystem vol0909</strong></span>
          </div>
        </div>
      </footer>

      {/* Action Modals */}
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        account={account}
        onExecuteTransfer={handleExecuteTransfer}
      />

      <ReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        accountHolder={account.accountHolder}
      />

    </div>
  );
}

