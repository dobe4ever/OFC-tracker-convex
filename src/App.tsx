import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { SessionForm } from "./components/SessionForm";
import { SessionsTable } from "./components/SessionsTable";
import { TotalsBox } from "./components/TotalsBox";
import { ProfitLossChart } from "./components/ProfitLossChart";
import { Modal } from "./components/Modal";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 font-sans antialiased">
      <Toaster position="top-center" />
      <Authenticated>
        <Dashboard />
      </Authenticated>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold tracking-tight">🍍 OFC tracker</h1>
              <p className="text-slate-500 text-xs mt-1">Sign in to your dashboard</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}

function Dashboard() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedTableSize, setSelectedTableSize] = useState<number | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loggedInUser === undefined) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-10 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍍</span>
          <h1 className="font-bold text-sm tracking-tight">OFC tracker</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            {/* New Session */}
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <SignOutButton />
        </div>
      </header>

      <main className="flex flex-col lg:flex-row px-4 py-2 gap-2 w-full max-w-[1600px] mx-auto">

        {/* Right Column: Stats & Chart */}
        <div className="w-full lg:w-7/12 flex flex-col gap-2">
          <TotalsBox 
            selectedUser={selectedUser} 
            selectedTableSize={selectedTableSize}
          />
          <ProfitLossChart 
            selectedUser={selectedUser} 
            selectedTableSize={selectedTableSize}
          />
        </div>
				
				{/* Left Column: Table */}
        <div className="w-full lg:w-5/12">
          <SessionsTable 
            selectedUser={selectedUser} 
            selectedTableSize={selectedTableSize}
            onUserChange={setSelectedUser}
            onTableSizeChange={setSelectedTableSize}
          />
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Session">
        <SessionForm 
          currentUser={loggedInUser?.email ?? ""}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}