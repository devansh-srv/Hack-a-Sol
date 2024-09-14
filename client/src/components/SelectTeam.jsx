import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Add this import at the top of your file
import './style/customfont.css';

const teams = [
  { 
    name: 'Manchester United', 
    logo: '/man_ud.png',
    players: ['Kevin De Bruyne', 'Erling Haaland', 'Riyad Mahrez', 'Phil Foden', 'Ederson']
  },
  { 
    name: 'Man City', 
    logo: '/man_city.png',
    players: ['Marco Reus', 'Mats Hummels', 'Jude Bellingham', 'Julian Brandt', 'Youssoufa Moukoko']
  },
];

const TeamSelection = () => {
  const [homeTeam, setHomeTeam] = useState(teams[0]);
  const [awayTeam, setAwayTeam] = useState(teams[1]);

  const changeTeam = (direction, isHome) => {
    const currentTeam = isHome ? homeTeam : awayTeam;
    const currentIndex = teams.findIndex(team => team.name === currentTeam.name);
    const newIndex = (currentIndex + direction + teams.length) % teams.length;
    const newTeam = teams[newIndex];
    
    if (isHome) {
      setHomeTeam(newTeam);
    } else {
      setAwayTeam(newTeam);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg3.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-25"></div>
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <h1 className="text-6xl font-bold text-white text-center mb-16 premier-league-font">Premier League Prediction</h1>
        
        <div className="bg-[#0F162B] rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <TeamCard team={homeTeam} onChange={(direction) => changeTeam(direction, true)} />
            <div className="text-3xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">VS</div>
            <TeamCard team={awayTeam} onChange={(direction) => changeTeam(direction, false)} />
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">Home Players</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {homeTeam.players.map((player, index) => (
                <PlayerButton key={index} player={player} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <img src="/premier-league.svg" alt="Premier League Logo" className="absolute bottom-4 right-4 w-32 h-32" />
    </div>
  );
};

const TeamCard = ({ team, onChange }) => (
  <div className="flex flex-col items-center">
    <img src={team.logo} alt={team.name} className="w-24 h-24 mb-2" />
    <h2 className="text-xl font-semibold text-white mb-2">{team.name}</h2>
    <div className="flex space-x-2">
      <button onClick={() => onChange(-1)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
        <ChevronLeft size={20} />
      </button>
      <button onClick={() => onChange(1)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
);

const PlayerButton = ({ player }) => (

  <Link to={`/player?player=${player.replace(/ /g,'')}`} className="select-player-link">
    <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
      {player}
    </button>
  </Link>
);

export default TeamSelection;
