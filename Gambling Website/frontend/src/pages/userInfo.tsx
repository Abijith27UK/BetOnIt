import React from "react";
import { FaRupeeSign } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

interface Bet {
  gameId: number;
  gameName: string;
  stake: number;
  status: "Won" | "Lost" | "Pending";
}

const Dashboard: React.FC = () => {
  // Hardcoded values for frontend testing
  const username = "JohnDoe";
  const email = "johndoe@example.com";
  const balance = 12500.75;

  const currentBets: Bet[] = [
    { gameId: 1, gameName: "India vs Australia", stake: 500, status: "Pending" },
    { gameId: 2, gameName: "MI vs CSK", stake: 800, status: "Pending" },
  ];

  const betHistory: Bet[] = [
    { gameId: 3, gameName: "Liverpool vs Real Madrid", stake: 1000, status: "Won" },
    { gameId: 4, gameName: "RR vs RCB", stake: 700, status: "Lost" },
  ];

  const onLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-500" style={{ fontFamily: "'Press Start 2P', cursive" }}>$$ BetOnIt Dashboard $$</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold"
          >
            <MdLogout />
            Logout
          </button>
        </div>

        {/* User Info Card */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 bg-gray-800 rounded-2xl p-6 shadow-md">
          <div>
            <p className="text-gray-400">Username</p>
            <p className="font-bold text-lg">{username}</p>
          </div>
          <div>
            <p className="text-gray-400">Email</p>
            <p className="font-bold text-lg">{email}</p>
          </div>
          <div>
            <p className="text-gray-400">Account Balance</p>
            <p className="text-green-400 text-xl font-extrabold flex items-center">
              <FaRupeeSign className="mr-1" /> {balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Deposit / Withdraw */}
        <div className="flex gap-4">
          <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold shadow-md" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Deposit
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg font-bold shadow-md" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Withdraw
          </button>
        </div>

        {/* Current Active Bets */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            📈 Current Bets
          </h2>
          <div className="space-y-3">
            {currentBets.length === 0 ? (
              <p className="text-gray-400">No active bets.</p>
            ) : (
              currentBets.map((bet) => (
                <div
                  key={bet.gameId}
                  className="bg-gray-800 rounded-lg p-4 flex justify-between items-center shadow-md"
                >
                  <div>
                    <p className="text-white font-semibold">{bet.gameName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Stake</p>
                    <p className="text-lg font-bold text-yellow-400">₹{bet.stake}</p>
                  </div>
                  <div className="text-sm font-semibold px-4 py-1 rounded-full bg-gray-700 text-white">
                    {bet.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bet History */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            🕘 Bet History
        </h2>
          <div className="space-y-3">
            {betHistory.length === 0 ? (
              <p className="text-gray-400">No previous bets.</p>
            ) : (
              betHistory.map((bet) => (
                <div
                  key={bet.gameId}
                  className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-semibold">{bet.gameName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Stake</p>
                    <p className="text-lg font-bold text-yellow-400">₹{bet.stake}</p>
                  </div>
                  <div
                    className={`text-sm font-semibold px-4 py-1 rounded-full ${
                      bet.status === "Won"
                        ? "bg-green-700 text-white"
                        : bet.status === "Lost"
                        ? "bg-red-700 text-white"
                        : "bg-yellow-600 text-black"
                    }`}
                  >
                    {bet.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;