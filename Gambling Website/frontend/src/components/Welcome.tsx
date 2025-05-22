export const Welcome = () => {
  return (
    <div className="animate-fade-in-up mb-24 lg:mb-32  bg-gradient-to-r from-black via-gray-900 to-black w-[95%] max-w-screen-lg mx-auto px-6 sm:px-14 py-14 rounded-[36px] shadow-2xl">
      <div className="flex flex-col lg:grid lg:grid-cols-[45%,1fr] gap-12 lg:gap-28 items-center lg:items-start">
        <div className="rounded-xl w-full max-w-md lg:max-w-none">
          <img
            src="Welcome_logo.png"
            alt="casino-welcome"
            className="w-full max-w-full h-auto object-contain"
            style={{ maxHeight: '320px' }} // cap image height so it doesn't blow up on mobiles
          />
        </div>
        <div className=" mt-8 lg:mt-0 text-center lg:text-left px-2 sm:px-0">
          <h1
            className="text-5xl sm:text-6xl text-white font-bold text-center"
            style={{ fontFamily: 'Rajdhani, cursive', lineHeight: 1.1 }}
          >
            Welcome to <br />
            <span className="inline-block mt-2">🎊BetOnIt🎊</span>
          </h1>
          <p
            className="text-base sm:text-xl mt-6 text-white text-justify max-w-lg mx-auto lg:mx-0"
            style={{ fontFamily: 'Rajdhani' }}
          >
            Dive into an electrifying gambling experience!
            BetOnIt is your ultimate playground for thrilling Plinko action, high-stakes cricket bets and sharp prop wagers.
            Test your luck, back your instincts, and dive into live games — where every spin, every run, and every opinion counts!
          </p>
        </div>
      </div>
    </div>
  );
};
