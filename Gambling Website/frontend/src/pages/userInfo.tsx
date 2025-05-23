import React , {useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

interface Bet {
  gameId: number;
  gameName: string;
  amount: number;
  status: "Won" | "Lost" | "Pending";
}

interface UserData {
  username: string;
  email: string;
  balance: number;
  currentBets: Bet[];
  betHistory: Bet[];
}   

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth-token"); // Or wherever you store it
        const res = await axios.get("http://localhost:3000/dashboard", {
          headers: {
            "x-auth-token": token || "",
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchData();
  }, []);
  if (!userData) return <div>Loading...</div>;
  const { isSignedIn, logout } = useAuth();
  const onLogout = () => {
    if (isSignedIn) {
      logout(); // Clear token
      navigate("/signin");
    } else {
      navigate("/signin");
    }
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
            <p className="font-bold text-lg">{userData.username}</p>
          </div>
          <div>
            <p className="text-gray-400">Email</p>
            <p className="font-bold text-lg">{userData.email}</p>
          </div>
          <div>
            <p className="text-gray-400">Account Balance</p>
            <p className="text-green-400 text-xl font-extrabold flex items-center">
              <FaRupeeSign className="mr-1" /> {userData.balance.toFixed(2)}
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
            {userData.currentBets.length === 0 ? (              
              <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center shadow-md">
                  <div>
                    <p className="text-white font-semibold">No bids</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Stake</p>
                    <p className="text-lg font-bold text-yellow-400">₹000</p>
                  </div>
                  <div className="text-sm font-semibold px-4 py-1 rounded-full bg-gray-700 text-white">
                    Null
                  </div>
                </div>
            ) : (
              userData.currentBets.map((bet) => (
                <div
                  key={bet.gameId}
                  className="bg-gray-800 rounded-lg p-4 flex justify-between items-center shadow-md"
                >
                  <div>
                    <p className="text-white font-semibold">{bet.gameName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Stake</p>
                    <p className="text-lg font-bold text-yellow-400">₹{bet.amount}</p>
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
            {userData.betHistory.length === 0 ? (
              <p className="text-gray-400">No previous bets.</p>
            ) : (
              userData.betHistory.map((bet) => (
                <div
                  key={bet.gameId}
                  className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-semibold">{bet.gameName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Stake</p>
                    <p className="text-lg font-bold text-yellow-400">₹{bet.amount}</p>
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