import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import axios from "axios";
import { Button } from "../components/ui";
import { baseURL } from "../utils";

export function Game() {
  const [ballManager, setBallManager] = useState<BallManager>();
  const canvasRef = useRef<any>();
  const [balance, setBalance] = useState<number | null>(null);
  const [lastPrize, setLastPrize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement
      );
      setBallManager(ballManager);
    }

    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    const token = localStorage.getItem("auth-token");
    try {
      const res = await axios.get(`${baseURL}/dashboard`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  const handleAddBall = async () => {
    const token = localStorage.getItem("auth-token");
    setIsProcessing(true);
    setLastPrize(null); // Reset old reward for animation
    try {
      const response = await axios.post(
        `${baseURL}/game`,
        { data: 1 },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      // Drop ball immediately
      if (ballManager) {
        ballManager.addBall(response.data.point);
      }

      // Wait 10 seconds for animation to complete
      setTimeout(() => {
        const multiplier = response.data.multiplier;
        const prize = Math.round(10 * multiplier);
        setLastPrize(prize);
        setBalance((prev) => (prev !== null ? prev - 10 + prize : null));
        setIsProcessing(false);
      }, 6800); // 10 seconds
    } catch (err) {
      console.error("Game error:", err);
      alert("Error playing game.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col lg:flex-row items-center justify-center p-6 gap-10 font-grotesk">      
      {/* Responsive canvas */}
      <div className="w-full max-w-[600px] aspect-square bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          className="w-full h-full object-contain"
        ></canvas>
      </div>
      {/* Control Card */}
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-black rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-indigo-600 flex flex-col gap-6 items-center text-center text-white">

      {/* Plinko Heading */}
      <h2 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg font-grotesk">
        🎯 Plinko
      </h2>

      {/* Balance */}
      <div>
        <div className="text-2xl font-bold text-green-400 font-grotesk">
          ₹{balance !== null ? balance : "Loading..."}
        </div>
        <div className="text-sm text-gray-300 font-grotesk">Your Balance</div>
      </div>

      {/* Prize Info or Loading */}
      <div className="h-6 font-grotesk">
        {isProcessing ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto" />
        ) : lastPrize !== null ? (
          <div className="text-xl font-semibold text-yellow-300 animate-pulse">
            +₹{lastPrize}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">No win yet</div>
        )}
      </div>
      {/* Drop Button */}
      <Button
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg py-2 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAddBall}
        disabled={isProcessing}
      >
        Drop Ball (₹10)
      </Button>
    </div>
    </div>
  );
}
