import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { baseURL } from "../utils";
// import { useAuth } from "../hooks/useAuth";

interface Match {
  _id: string;
  gameName: string;
  teamA: string;
  teamB: string;
  startTime: string;
  timeframe: number;
  betSummary: {
    totalAmountA: number;
    totalAmountB: number;
  };
}

interface OddsUpdate {
  matchId: string;
  odds: {
    oddsA: number;
    oddsB: number;
  };
}

const timeframeDurations = [0, 300000, 300000]; // 5 min for 1st and 2nd halves

const getTimeframeLabel = (tf: number) => {
  switch (tf) {
    case 0: return { label: "⦿ Pre Match", color: "text-yellow-400" };
    case 1: return { label: "⦿ 1st Half", color: "text-blue-400" };
    case 2: return { label: "⦿ 2nd Half", color: "text-green-400" };
    default: return { label: "⦿ Closed", color: "text-red-400" };
  }
};

const SportsBettingPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [bids, setBids] = useState<Record<string, { teamA: number; teamB: number }>>({});
  const [userBalance, setUserBalance] = useState<number>(0);
  const [odds, setOdds] = useState<Record<string, { oddsA: number; oddsB: number }>>({});

  useEffect(() => {
    const fetchMatches = async () => {
      const res = await axios.get(`${baseURL}/getMatches`);
      setMatches(res.data.matches);
    };
    
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const res = await axios.get(`${baseURL}/getUser`, {
          headers: {
            "x-auth-token": token || "",
          },
        });
        setUserBalance(res.data.user.balance);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchMatches();
    fetchUser();

    // Initialize Socket.IO connection
    const socket = io(baseURL);
    
    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
      // Request initial odds when connected
      socket.emit('requestInitialOdds');
    });

    // Listen for odds updates
    socket.on("sportsOddsUpdate", (updates: OddsUpdate[]) => {
      const newOdds = { ...odds };
      updates.forEach(update => {
        newOdds[update.matchId] = update.odds;
      });
      setOdds(newOdds);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateBid = (matchId: string, team: "teamA" | "teamB", action: "inc" | "dec") => {
    setBids((prev) => {
      const current = prev[matchId] || { teamA: 0, teamB: 0 };
    //   const cost = action === "inc" ? 100 : -100;
      if (action === "dec" && current[team] === 0) return prev;
      if (userBalance + (action === "dec" ? 100 : 0) < 100 && action === "inc") return prev;
      return {
        ...prev,
        [matchId]: {
          ...current,
          [team]: Math.max(0, current[team] + (action === "inc" ? 1 : -1)),
        },
      };
    });
    setUserBalance((prev) => prev + (action === "dec" ? 100 : -100));
  };

  const handleFinalizeBid = async (matchId: string) => {
    const bid = bids[matchId];
    if (!bid || (bid.teamA === 0 && bid.teamB === 0)) return;
    const match = matches.find((m) => m._id === matchId);
    if (!match) {
        console.error(`Match with ID ${matchId} not found.`);
        return;
    }
    const timeFrame = getTimeframe(match.startTime);
    const token = localStorage.getItem("auth-token");
    try {
        const res = await axios.get(`${baseURL}/getUser`, {
        headers: {
            "x-auth-token": token || "",
        },
        });
        const userId = res.data.user._id;
        if (!userId) {
        console.error("User ID not found");
        return;
        }
        if (bid.teamA > 0) {
        await axios.post(
            `${baseURL}/api/bet`,
            {
            matchId,
            gameName : match.gameName,
            userId,
            team: "TeamA",
            amount: bid.teamA * 100,
            timeFrame,
            },
            {
            headers: { "x-auth-token": token || "" },
            }
        );
        }
        if (bid.teamB > 0) {
        await axios.post(
            `${baseURL}/api/bet`,
            {
            matchId,
            gameName : match.gameName,
            userId,
            team: "TeamB",
            amount: bid.teamB * 100,
            timeFrame,
            },
            {
            headers: { "x-auth-token": token || "" },
            }
        );
        }
        // await axios.post(
        // "http://localhost:3000/api/finalize",
        // { matchId },
        // {
        //     headers: { "x-auth-token": token || "" },
        // }
        // );
        setBids((prev) => {
        const newBids = { ...prev };
        delete newBids[matchId];
        return newBids;
        });
    } catch (error) {
        console.error("Error finalizing bid:", error);
    }
    };

  const getTimeframe = (startTime: string): number => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    if (now < start) return 0;
    if (now < start + timeframeDurations[1]) return 1;
    if (now < start + timeframeDurations[1] + timeframeDurations[2]) return 2;
    return 3;
  };

  const calculateOdds = (match: Match, timeframe: number) => {
    if (timeframe === 0) return { oddsA: 50, oddsB: 50 }; // Pre-match
    const { totalAmountA, totalAmountB } = match.betSummary || { totalAmountA: 0, totalAmountB: 0 };
    const total = totalAmountA + totalAmountB;
    if (total === 0) return { oddsA: 50, oddsB: 50 }; // Avoid NaN
    const oddsA = Math.round((100 * totalAmountA) / total);
    const oddsB = 100 - oddsA;
    return { oddsA, oddsB };
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black p-6 text-white font-['Roboto_Mono']">
      <h1 className="text-4xl font-bold text-center mb-10 font-['Bebas_Neue'] tracking-wider">
        ⚽Live Sports Betting🏏
      </h1>
      <div className="text-right mb-6 text-lg font-['Space_Grotesk']">
        Balance: ₹{userBalance.toFixed(2)}
      </div>
      <div className="flex flex-col gap-8">
        {matches.map((match) => {
          const timeframe = getTimeframe(match.startTime);
          const { label, color } = getTimeframeLabel(timeframe);
          const bid = bids[match._id] || { teamA: 0, teamB: 0 };
          const matchOdds = odds[match._id] || { oddsA: 50, oddsB: 50 };
          
          return (
            <div
              key={match._id}
              className="flex flex-col lg:flex-row bg-gray-800 border border-gray-700 shadow-xl rounded-2xl p-4 gap-4"
            >
              {/* Bidding Section */}
              <div className="flex-1 w-full">
                <h2 className="text-2xl font-['Space_Grotesk'] font-bold mb-2">{match.gameName}</h2>
                <p className="text-lg mb-2">{match.teamA} vs {match.teamB}</p>
                <p className={`text-sm font-medium mb-4 ${color}`}>{label}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {["teamA", "teamB"].map((team) => {
                    const isTeamA = team === "teamA";
                    const teamName = isTeamA ? match.teamA : match.teamB;
                    const bgColor = isTeamA ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700";
                    const bidCount = bid[team as 'teamA' | 'teamB'];
                    return (
                      <div key={team}>
                        <h3 className="font-bold text-lg mb-2">{teamName}</h3>
                        <div className="flex gap-2 mb-2">
                          <button
                            className={`w-full py-2 px-4 ${bgColor} rounded-lg font-bold`}
                            onClick={() => updateBid(match._id, team as "teamA" | "teamB", "inc")}
                            disabled={timeframe === 3 || userBalance < 100}
                          >
                            + ₹100
                          </button>
                          <button
                            className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold"
                            onClick={() => updateBid(match._id, team as "teamA" | "teamB", "dec")}
                            disabled={bidCount === 0}
                          >
                            − ₹100
                          </button>
                        </div>
                        <p className="text-sm">Bids: {bidCount} | ₹{bidCount * 100}</p>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold"
                  onClick={() => handleFinalizeBid(match._id)}
                  disabled={timeframe === 3 || (bid.teamA === 0 && bid.teamB === 0)}
                >
                  Finalize Trade
                </button>
              </div>
              {/* Odds Display Card */}
              <div className="w-full lg:w-64 mt-6 lg:mt-0 flex flex-col justify-center items-center bg-black border border-gray-600 rounded-xl p-4 font-['Bebas_Neue']">
                <h4 className="text-xl text-gray-400 mb-2">Live Odds</h4>
                <div className="text-center text-white text-4xl mb-3">
                  {match.teamA}: <span className="text-red-400">{timeframe === 0? 50 : (timeframe === 3) ? "Closed" : matchOdds.oddsA}</span>
                </div>
                <div className="text-center text-white text-4xl">
                  {match.teamB}: <span className="text-blue-400">{timeframe === 0? 50 : (timeframe === 3) ? "Closed" : matchOdds.oddsB}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SportsBettingPage;
