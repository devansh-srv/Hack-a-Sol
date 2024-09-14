import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Radar, Pie, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useLocation, useSearchParams } from 'react-router-dom';

const SelectTeam = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [image, setImage] = useState('');
  
    const player = searchParams.get('player');
    const awayteam = searchParams.get('awayteam');

    const [data, setData] = useState({
        "Match": "Tottenham Hotspur vs Manchester City",
        "Team 1": "Tottenham Hotspur",
        "Team 2": "Manchester City",
        "Player": "Erling Haaland",
        "Team": "Manchester City",
        "Goals": 2,
        "Assists": 0,
        "TotalTackles": 0,
        "AccuratePasses": "12/14 (86%)",
        "DuelsWon": 6,
        "MinutesPlayed": 89,
        "Position": "F",
        "SofascoreRating": 8.0,
        "PassAccuracy": 86
    });

    // Radar chart data for overall performance
    const radarData = {
        labels: ['Goals', 'Assists', 'Tackles', 'Duels Won', 'Pass Accuracy'],
        datasets: [
            {
                label: 'Performance Stats',
                data: [data.Goals, data.Assists, data.TotalTackles, data.DuelsWon, data.PassAccuracy],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Pie chart for pass accuracy
    const pieData = {
        labels: ['Accurate Passes', 'Missed Passes'],
        datasets: [
            {
                label: 'Pass Accuracy',
                data: [12, 2], // Accurate passes vs missed passes
                backgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    // Line chart for time-based stats
    const lineData = {
        labels: ['0', '30', '60', '90'], // Time intervals in minutes
        datasets: [
            {
                label: 'Goals over Time',
                data: [0, 0, 1, 2], // Example progress of goals during the game
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
        ],
    };

    const chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 1.5, // Controls the height/width ratio of charts
    };

    const getData = async () => {
        const response = await fetch(`http://localhost:3000/player`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                player: player,
                awayteam: awayteam,
            })
        });

        if(response.status === 200){
            const json = await response.json();
            json.Match = `${player} VS ${awayteam}`;
            json.Player = player
            setData(json);
            console.log(json);
        }
    }

    const getImage = async () => {
        const response = await fetch(`http://localhost:3000/image?player=${player}`, {
            method: "GET",
        })

        if(response.status === 200){
            const json = await response.json();
            setImage(json.PlayerLink);
        }
    }

    useEffect(()=>{
        getData();
        getImage();
    }, [])

    return (
        <div className="flex flex-col md:flex-row justify-between items-start bg-gray-900 p-6 text-white space-y-6 md:space-y-0 md:space-x-10 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-800">
            {/* FIFA Card Image on the left */}
            <div className="relative w-72 h-auto">
                <img 
                    src={image} 
                    alt={`${data.Player} FIFA Card`} 
                    className="rounded-lg transition transform hover:scale-105 duration-300 shadow-lg"
                />
            </div>

            {/* Player Stats Section on the right */}
            <div className="flex flex-col space-y-4 w-full">
                <h1 className="text-4xl font-bold">{data.Player}</h1>
                <p className="text-lg font-light text-gray-300">{data.Team} | {data.Match}</p>

                {/* Radar Chart for Overall Performance */}
                <div className="flex flex-wrap justify-around">
                    <div className="w-64 h-64">
                        <Radar data={radarData} options={chartOptions} />
                    </div>

                    {/* Line Chart for Goals Progression */}
                    <div className="w-64 h-40">
                        <Line data={lineData} options={chartOptions} />
                    </div>

                    {/* Pie Chart for Pass Accuracy */}
                    <div className="w-40 h-40 mt-4">
                        <h2 className="text-xl font-bold mb-2">Pass Accuracy</h2>
                        <Pie data={pieData} options={chartOptions} />
                    </div>
                </div>

                {/* Circular Stats Section */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24">
                            <CircularProgressbar
                                value={data.Goals * 50} // 50% progress per goal
                                maxValue={100}
                                text={`${data.Goals} Goals`}
                                styles={buildStyles({
                                    pathColor: 'green',
                                    textColor: 'white',
                                    trailColor: 'gray',
                                })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24">
                            <CircularProgressbar
                                value={data.SofascoreRating * 10} // Scale rating to 100
                                text={`${data.SofascoreRating} Rating`}
                                styles={buildStyles({
                                    pathColor: 'yellow',
                                    textColor: 'white',
                                    trailColor: 'gray',
                                })}
                            />
                        </div>
                    </div>
                </div>

                {/* Display Remaining Stats */}
                <div className="mt-6 text-gray-300">
                    <h2 className="text-xl font-semibold">Additional Stats</h2>
                    <ul className="list-none mt-2 space-y-2">
                        <li><strong>Minutes Played:</strong> {data.MinutesPlayed} mins</li>
                        <li><strong>Total Tackles:</strong> {data.TotalTackles}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SelectTeam;
