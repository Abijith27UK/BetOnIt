import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiCodeforces ,SiCodechef , SiLeetcode } from "react-icons/si";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-600 py-12 text-white bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="w-[96%] max-w-screen-lg mx-auto flex flex-row justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
          <span className="self-center text-2xl font-semibold font-gamble whitespace-nowrap dark:text-white">
            BetOnIt
          </span>
          </Link>
        </div>
        {/* <div className="text-sm text-gray-400 mt-4">
              &copy; {new Date().getFullYear()} Abijith U K
        </div> */}
        <div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <a href="https://github.com/Abijith27UK" target="_blank">
                <FaGithub size={30} />
              </a>
              <a href="https://www.linkedin.com/in/abijith-u-k-79ba04281/" target="_blank">
                <FaLinkedin size={30} />
              </a>
              <a href="https://codeforces.com/profile/Abijith27UK" target="_blank">
                <SiCodeforces  size={30} />
              </a>
              <a href="https://www.codechef.com/users/abijith27uk" target="_blank">
                <SiCodechef  size={30} />
              </a>
              <a href="https://leetcode.com/u/Abijith27UK/" target="_blank">
                <SiLeetcode  size={30} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
