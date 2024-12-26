import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaChartSimple, FaChartLine, FaMagnifyingGlass, FaTrophy, FaMedal, FaGithub, FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";

const App = () => {

  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // State to manage loading

  const fetchData = async (userName) => {

    try {
      setIsLoading(true);  // Start loading when the request is made

      const response = await axios.get(`https://leetcode-back.vercel.app/${userName}`);

      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);

      toast.error(error.response.data.message || "An error occurred.");
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } finally {
      setIsLoading(false);  // Stop loading when data is fetched or error occurs
    }
  };

  const handleSearch = () => {
    if (userName.trim()) {
      setUserName(userName.trim());
      fetchData(userName.trim());
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gray-950 min-h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-5">
          <input
            type="text"
            placeholder="Enter Leetcode Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent outline-none text-black font-semibold"
          />
          <FaMagnifyingGlass
            className="text-gray-500 ml-2 w-7 h-7 cursor-pointer border-l-2 border-black py-1 hover:text-black"
            onClick={handleSearch}
          />
        </div>
      </div>
    );
  }

  // Your normal rendering logic here after data is fetched
  const userDetails = userData[0]?.data?.matchedUser;
  const languages = userData[1]?.data?.matchedUser?.languageProblemCount || [];
  const questions = userData[4]?.data;
  const coins = userData[4]?.data?.matchedUser?.contributions?.points || 0;
  const recentSubmissionList = userData[4]?.data?.recentSubmissionList || [];
  const badges = userData[5]?.data?.matchedUser?.badges || [];
  const userContestRanking = userData[6]?.data?.userContestRanking || {};

  const progressData = questions?.allQuestionsCount?.map((item, index) => ({
    difficulty: item.difficulty,
    total: item.count,
    solved: questions?.matchedUser?.submitStats?.acSubmissionNum[index]?.count || 0,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col sm:flex-row">
      {/* Left Sidebar */}
      <div className="md:w-1/4 bg-gray-900 hover:border-gray-200 border-2 hover:border-4 border-gray-500 m-5 p-5 rounded-2xl shadow-md md:sticky top-0 flex flex-col">
        {/* Search Input */}
        <div className="flex items-center bg-transparent border-2 order-gray-100 rounded-full px-4 py-2 mb-5">
          <input
            type="text"
            placeholder="Enter Leetcode Username"
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={handleKeyDown}  // Added here for Enter key press
            className="text-gray-100 ml-2 w-full h-full bg-transparent  outline-none py-1 hover:text-white"
          />
          <FaMagnifyingGlass className="text-gray-200 ml-2 w-5 h-5 cursor-pointer hover:text-white" onClick={handleSearch} />
        </div>

        {/* User Details */}
        <img
          src={userDetails?.profile?.userAvatar}
          alt="User Avatar"
          className="w-28 h-28 rounded-2xl mx-auto transition-transform duration-300 ease-in-out transform hover:scale-110"
        />
        <h2 className="mt-4 text-2xl font-bold text-center text-white">
          <a href={`https://leetcode.com/u/${userName}/`} target="_blank" rel="noopener noreferrer">
            {userDetails?.profile?.realName || userDetails?.username}
          </a>
        </h2>
        <p className="mt-0 text-center flex justify-center text-gray-100 font-semibold">
          <img
            src="https://assets.leetcode.com/static_assets/public/images/coin.gif"
            alt="Leetcoin"
            className="w-6 h-6 mr-2"
          />
          {coins}
        </p>

        {/* Top Languages */}
        <div className="mt-4">
          <h3 className="flex justify-center mb-0 text-gray-200 font-extrabold">TOP LANGUAGES</h3>
          <ul className="grid grid-cols-3 gap-2">
            {languages
              .sort((a, b) => b.problemsSolved - a.problemsSolved)
              .slice(0, 6)
              .map((lang) => (
                <li
                  key={lang.languageName}
                  className="flex hover:bg-indigo-200 cursor-pointer border-2 text-indigo-400 border-indigo-400 hover:border-indigo-800 transition-transform duration-300 ease-in-out transform hover:scale-110 rounded-full py-2 px-1 justify-center shadow-md shadow-gray-600 hover:text-indigo-900 text-sm font-bold"
                >
                  {lang.languageName}
                </li>
              ))}
          </ul>
        </div>

        {/* Contest Stats */}
        <div className="mt-4">
          <h3 className="font-extrabold flex text-gray-200 justify-center">CONTEST STATS</h3>
          <ul className="space-y-3">
            {/* Contests Attended */}
            <li className="flex items-center group border-2 p-2 hover:bg-lime-100 shadow-sm hover:shadow-lime-700 shadow-lime-700 hover:shadow-md text-lime-700 font-bold cursor-pointer border-lime-700 rounded-xl">
              <FaTrophy className="text-lime-700 w-6 h-6 mr-2" />
              <span className="flex-1 text-left group-hover:hidden">
                {userContestRanking.attendedContestsCount || "N/A"}
              </span>
              <span className="flex-1 text-left hidden group-hover:block">
                {userContestRanking.attendedContestsCount
                  ? `You have attended ${userContestRanking.attendedContestsCount} contests`
                  : "Participate in a contest to view this !"
                }
              </span>
            </li>

            {/* Rating */}
            <li className="flex items-center group border-2 p-2 hover:bg-amber-100 shadow-sm hover:shadow-amber-700 shadow-amber-700 hover:shadow-md text-amber-700 font-bold cursor-pointer border-amber-700 rounded-xl">
              <FaMedal className="text-amber-700 w-6 h-6 mr-2" />
              <span className="flex-1 text-left group-hover:hidden">
                {userContestRanking.rating?.toFixed(2) || "N/A"}
              </span>
              <span className="flex-1 text-left hidden group-hover:block">
                {userContestRanking.rating
                  ? `Your current rating is ${userContestRanking.rating.toFixed(2)}`
                  : "Participate in a contest to view this !"
                }
              </span>
            </li>

            {/* Global Ranking */}
            <li className="flex items-center group border-2 p-2 hover:bg-sky-100 shadow-sm hover:shadow-sky-700 shadow-sky-700 hover:shadow-md text-sky-700 border-sky-700 font-bold cursor-pointer rounded-xl">
              <FaChartSimple className="text-sky-700 w-6 h-6 mr-2" />
              <span className="flex-1 text-left group-hover:hidden">
                {userContestRanking.globalRanking && userContestRanking.totalParticipants
                  ? `${userContestRanking.globalRanking} / ${userContestRanking.totalParticipants}`
                  : "N/A"
                }
              </span>
              <span className="flex-1 text-left hidden group-hover:block">
                {userContestRanking.globalRanking && userContestRanking.totalParticipants
                  ? `Your global ranking is ${userContestRanking.globalRanking} / ${userContestRanking.totalParticipants}`
                  : "Participate in a contest to view this !"
                }
              </span>
            </li>

            {/* Top Percentage */}
            <li className="flex items-center group group border-2 p-2 hover:bg-pink-100 shadow-sm shadow-pink-700 hover:shadow-pink-700 hover:shadow-md text-pink-700 font-bold cursor-pointer border-pink-700 rounded-xl">
              <FaChartLine className="text-pink-700 w-6 h-6 mr-2" />
              <span className="flex-1 text-left group-hover:hidden">
                {userContestRanking.topPercentage
                  ? `${userContestRanking.topPercentage.toFixed(2)}%`
                  : "N/A"
                }
              </span>
              <span className="flex-1 text-left hidden group-hover:block">
                {userContestRanking.topPercentage
                  ? `You are in top ${userContestRanking.topPercentage.toFixed(2)}% on the platform`
                  : "Participate in a contest to view this !"
                }
              </span>
            </li>
          </ul>
        </div>

        {/* Star on GitHub */}
        <div className="mt-auto">
          <a href="https://github.com/MOSAKO021/leetstats" target="_blank" rel="noopener noreferrer">
            <button className="flex items-center justify-center w-full bg-gray-200 text-gray-800 font-bold hover:bg-gray-900 hover:text-gray-200 hover:border-2 hover:border-gray-200 py-2 px-4 rounded-lg mt-4">
              <FaStar className="w-5 h-5 mr-2" />
              Star at Github
              <FaGithub className="ml-2 w-5 h-5 mr-2" />
            </button>
          </a>
        </div>

      </div>



      {/* Right Main Content */}
      <div className="flex-1 p-5 sm:mt-0 mt-4 overflow-y-auto text-white" style={{ maxHeight: "calc(100vh)" }}>
        <div className="bg-gray-900 hover:border-gray-200 p-5 border-2 hover:border-4 border-gray-500 shadow-md rounded-2xl mb-8">
          <h2 className="text-xl font-bold mb-4">Questions Solved</h2>
          <div className="grid grid-cols-4 gap-4">
            {progressData.map((item) => {
              const mainColor =
                item.difficulty === "Easy"
                  ? "#166534"
                  : item.difficulty === "Medium"
                    ? "#ea580c"
                    : item.difficulty === "Hard"
                      ? "#e11d48"
                      : "#86198f";

              const trailColor =
                item.difficulty === "Easy"
                  ? "#a7f3d0" // Lighter green
                  : item.difficulty === "Medium"
                    ? "#fed7aa" // Lighter orange
                    : item.difficulty === "Hard"
                      ? "#fecdd3" // Lighter red
                      : "#f0abfc"; // Lighter purple

              return (
                <div key={item.difficulty} className="flex flex-col items-center">
                  <CircularProgressbar
                    value={(item.solved / item.total) * 100}
                    text={`${item.solved}/${item.total}`}
                    strokeWidth={4}
                    styles={buildStyles({
                      textSize: "15px",
                      pathColor: mainColor,
                      textColor: "#fff",
                      trailColor: trailColor,
                    })}
                    className="w-28 h-28 transition-transform duration-300 ease-in-out transform hover:scale-125"
                  />
                  <p className="mt-2 font-bold uppercase">{item.difficulty}</p>
                </div>
              );
            })}
          </div>
        </div>


        <div className="p-5 shadow-md bg-gray-900 hover:border-gray-200 border-2 hover:border-4 border-gray-500 rounded-2xl mb-8">
          <h2 className="text-xl font-bold mb-4">Badges</h2>
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center">
                <img
                  src={badge.medal.config.iconGif}
                  alt={badge.displayName}
                  className="w-16 h-16 transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-pointer"
                />
                <p className="mt-2 font-bold text-center">{badge.displayName}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 hover:border-gray-200 border-2 hover:border-4 border-gray-500 p-5 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
          <ul className="space-y-3">
            {recentSubmissionList.map((submission, index) => (
              <a
                key={index}
                href={`https://leetcode.com/problems/${submission.titleSlug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className=""
              >
                <li
                  className={`relative flex items-center mb-1 justify-between p-3 rounded-lg shadow-sm border-2 transition ${submission.statusDisplay === "Accepted"
                    ? "bg-teal-10 hover:bg-teal-200 border-teal-700 text-teal-700"
                    : submission.statusDisplay === "Wrong Answer"
                      ? "bg-red-10 hover:bg-red-200 border-red-700 text-red-700"
                      : "bg-yellow-10 hover:bg-yellow-200 border-yellow-700 text-yellow-700"
                    }`}
                >
                  <h3 className="font-bold flex-grow">{submission.title}</h3>
                  <div className="absolute top-full left-0 mt-2 w-full p-3 bg-white rounded-lg shadow-lg z-10 hidden group-hover:block">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">Status:</span> {submission.statusDisplay}
                    </p>
                  </div>
                </li>
              </a>
            ))}
          </ul>
        </div>


      </div>
    </div>
  );
};

export default App;
