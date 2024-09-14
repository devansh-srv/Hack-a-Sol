import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style/selecteam.css';

const teams = [
    { 
        name: 'Manchester City', 
        logo: '/testteam.png',
        players: ['Kevin De Bruyne', 'Erling Haaland', 'Riyad Mahrez', 'Phil Foden', 'Ederson']
    },
    { 
        name: 'Bor. Dortmund', 
        logo: '/testteam.png',
        players: ['Marco Reus', 'Mats Hummels', 'Jude Bellingham', 'Julian Brandt', 'Youssoufa Moukoko']
    },
    { 
        name: 'Real Madrid', 
        logo: '/testteam.png',
        players: ['Karim Benzema', 'Luka Modric', 'Vinícius Jr.', 'Toni Kroos', 'Thibaut Courtois']
    },
    { 
        name: 'Barcelona', 
        logo: '/testteam.png',
        players: ['Robert Lewandowski', 'Pedri', 'Frenkie de Jong', 'Ousmane Dembélé', 'Marc-André ter Stegen']
    }
];

const SelectTeam = () => {
    const [selectedHomeTeam, setSelectedHomeTeam] = useState(teams[0]);
    const [selectedAwayTeam, setSelectedAwayTeam] = useState(teams[1]);
    
    const [players, setPlayers] = useState([]);

    const changeHomeTeamForward = () => {
        const nextIndex = (teams.indexOf(selectedHomeTeam) + 1) % teams.length;
        setSelectedHomeTeam(teams[nextIndex]);
        setPlayers(teams[nextIndex].players)
    };

    const changeHomeTeamBackward = () => {
        const nextIndex = (teams.indexOf(selectedHomeTeam) - 1 + teams.length) % teams.length;
        setSelectedHomeTeam(teams[nextIndex]);
        setPlayers(teams[nextIndex].players)
    };

    const changeAwayTeamForward = () => {
        const nextIndex = (teams.indexOf(selectedAwayTeam) + 1) % teams.length;
        setSelectedAwayTeam(teams[nextIndex]);
    };

    const changeAwayTeamBackward = () => {
        const nextIndex = (teams.indexOf(selectedAwayTeam) - 1 + teams.length) % teams.length;
        setSelectedAwayTeam(teams[nextIndex]);
    };

    const getTeams = async () => {
        const response = await fetch("http://localhost:3000/teams",{
            method: "GET",
        })

        if(response.status === 200){
            const json = await response.json();
            teams = json.teams
            teams = json.teams
            setPlayers(teams[0].players)
        }
    }

    useEffect(()=>{
        setPlayers(teams[0].players) // for now temp
        getTeams();
        //getPlayers("somethign");
    },[])

    return (
        <div className="team-selection-container">
            <div className="premierleague">Premier League</div>
            <div className="team-selection">
                <div className="team-card">
                    <img src={selectedHomeTeam.logo} alt="Home Team" className="team-logo" />
                    <h2>{selectedHomeTeam.name}</h2>
                    <div className="change-team-buttons-container">
                        <button className="change-team-button" onClick={changeHomeTeamBackward}>
                            <img className="change-team-image" src="/backward-logo.png"/>
                        </button>
                        <button className="change-team-button" onClick={changeHomeTeamForward}>
                            <img className="change-team-image" src="/forward-logo.png"/>
                        </button>
                    </div>
                </div>
                <div className="vs">VS</div>
                <div className="team-card">
                    <img src={selectedAwayTeam.logo} alt="Away Team" className="team-logo" />
                    <h2>{selectedAwayTeam.name}</h2>
                    <div className="change-team-buttons-container">
                        <button className="change-team-button" onClick={changeAwayTeamBackward}>
                            <img className="change-team-image" src="/backward-logo.png"/>
                        </button>
                        <button className="change-team-button" onClick={changeAwayTeamForward}>
                            <img className="change-team-image" src="/forward-logo.png"/>
                        </button>
                    </div>
                </div>
            </div>

            <div className="player-list-container">
                <div className="homeplayers">Home Players</div>
                <ul className="player-list">
                    {players.map((player, index) => (
                        <li key={index} className="player-item">
                            {player}
                            <Link to={`/player?player=${player.replace(/ /g,'')}&awayteam=${selectedAwayTeam.name.replace(/ /g, '')}`} className="select-player-link">
                                <button className="select-player-button">Select</button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SelectTeam;
