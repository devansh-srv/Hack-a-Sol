import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play, SkipForward } from 'lucide-react';
import './style/customfont.css';

const songs = [
  { title: "Love Me Again", artist: "John Newman", src: "/Love Me Again - John Newman.mp3" },
  { title: "Feet Don't Fail Me Now", artist: "Joy Crookes", src: "/Feet Dont Fail Me Now.mp3" },
];

const TeamSelection = () => {
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initialize indices
  const [homeIndex, setHomeIndex] = useState(0);
  const [awayIndex, setAwayIndex] = useState(1);

  // Function to fetch teams from the API
  const getTeams = async () => {
    try {
      const response = await fetch('http://54.147.52.167:3000/teams');
      if (response.status === 200) {
        const data = await response.json();
        setTeams(data);
        if (data.length > 0) {
          setHomeTeam(data[0]);
          setAwayTeam(data.length > 1 ? data[1] : null);
        }
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].src;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex, isPlaying]);

  // Function to change teams
  const changeTeam = (direction, isHome) => {
    if (teams.length === 0) return; // Avoid errors if teams are not yet loaded

    if (isHome) {
      setHomeIndex(prevIndex => {
        const newIndex = (prevIndex + (direction ? 1 : teams.length - 1)) % teams.length;
        setHomeTeam(teams[newIndex]);
        return newIndex;
      });
    } else {
      setAwayIndex(prevIndex => {
        const newIndex = (prevIndex + (direction ? 1 : teams.length - 1)) % teams.length;
        setAwayTeam(teams[newIndex]);
        return newIndex;
      });
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentSongIndex(prevIndex => (prevIndex + 1) % songs.length);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg3.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-25"></div>
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <h1 className="text-6xl font-bold text-white text-center mb-12 premier-league-font">Premier League Prediction</h1>
        
        <div className="bg-[#0F162B] rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8 h-48">
            <div className="w-1/3 flex justify-center">
              <div className="flex flex-col items-center justify-between h-full">
                {homeTeam && <img src={`${homeTeam.Team}.png`} alt={homeTeam.Team} className="w-24 h-24 mb-2" />}
                {homeTeam && <h2 className="text-xl font-semibold text-white mb-2 text-center">{homeTeam.Team}</h2>}
                <div className="flex space-x-2">
                  <button onClick={() => changeTeam(false, true)} className="bg-[#E62498] hover:bg-opacity-80 text-white p-2 rounded-full">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => changeTeam(true, true)} className="bg-[#E62498] hover:bg-opacity-80 text-white p-2 rounded-full">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-1/3 flex justify-center">
              <div className="text-3xl font-bold text-white">VS</div>
            </div>
            <div className="w-1/3 flex justify-center">
              <div className="flex flex-col items-center justify-between h-full">
                {awayTeam && <img src={`${awayTeam.Team}.png`} alt={awayTeam.Team} className="w-24 h-24 mb-2" />}
                {awayTeam && <h2 className="text-xl font-semibold text-white mb-2 text-center">{awayTeam.Team}</h2>}
                <div className="flex space-x-2">
                  <button onClick={() => changeTeam(false, false)} className="bg-[#E62498] hover:bg-opacity-80 text-white p-2 rounded-full">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => changeTeam(true, false)} className="bg-[#E62498] hover:bg-opacity-80 text-white p-2 rounded-full">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-3 text-center">Home Players</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {homeTeam && homeTeam.PlayerName.map((player, index) => (
                <Link key={index} to={`/player?player=${player}&awayteam=${awayTeam?.Team}`} className="select-player-link">
                  <button className="w-full bg-[#0e7c7b] hover:bg-opacity-80 text-white font-semibold py-1 px-2 rounded text-sm transition duration-300 ease-in-out transform hover:scale-105">
                    {player}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <img src="/premier-league.svg" alt="Premier League Logo" className="absolute bottom-4 right-4 w-32 h-32" />
      
      {/* Media Player */}
      <div className="absolute bottom-4 left-4 bg-[#0F162B] p-4 rounded-lg shadow-lg">
        <div className="text-white mb-2">
          <p className="font-bold">{songs[currentSongIndex]?.title}</p>
          <p className="text-sm">{songs[currentSongIndex]?.artist}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={togglePlay} className="bg-[#E62498] hover:bg-opacity-80 text-white p-2 rounded-full">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={nextSong} className="bg-[#E62498] hover:bg-opacity-80 text-white p-2 rounded-full">
            <SkipForward size={20} />
          </button>
        </div>
        <audio ref={audioRef} onEnded={nextSong} />
      </div>
    </div>
  );
};

export default TeamSelection;
