import sys
import pandas as pd
import joblib
import json
from sklearn.preprocessing import LabelEncoder
with open(r'D:\Programs\Hack-A-Sol\Hack-a-Sol\model\final_cleaned.json') as file:
    data = json.load(file)

# Prepare an empty list to store the extracted player statistics
player_stats = []

# Iterate over the data and extract relevant features for each player
for match_id, match_info in data.items():
    teams = match_info['player_statistics']

    for team, players in teams.items():
        for player in players:
            player_stats.append({
                'player_name': player['player_name'],
                'team': team,
                'goals': int(player['Goals']),
                'assists': int(player['Assists']),
                'total_tackles': int(player['Total tackles']),
                'accurate_passes': int(player['Accurate passes'].split('/')[0]),
                'duels_won': int(player['Duels (won)'].split('(')[-1].replace(')', '')),
                'minutes_played': int(player['Minutes played'].replace("'", "")),
                'position': player['Position'],
                'sofascore_rating': float(player['Sofascore Rating'].replace("-",'0')),
                'opponent': match_info['teams']['away_team'] if match_info['teams']['home_team'] == team else match_info['teams']['home_team']
            })


# Load the saved models
rf_model = joblib.load(r'D:\Programs\Hack-A-Sol\Hack-a-Sol\model\rf_model.pkl')
xgb_model = joblib.load(r'D:\Programs\Hack-A-Sol\Hack-a-Sol\model\xgb_model.pkl')
gbr_model = joblib.load(r'D:\Programs\Hack-A-Sol\Hack-a-Sol\model\gbr_model.pkl')

# Function to predict performance based on player name and opponent
def predict_player_performance(player_name, opponent, player_data, df):
    # Encode the labels for player data
    le_position = LabelEncoder()
    df['position_encoded'] = le_position.fit_transform(df['position'])
    
    le_team = LabelEncoder()
    df['team_encoded'] = le_team.fit_transform(df['team'])
    
    le_opponent = LabelEncoder()
    df['opponent_encoded'] = le_opponent.fit_transform(df['opponent'])

    # Filter data for the selected player and opponent
    player_data = df[(df['player_name'] == player_name) & (df['opponent'] == opponent)]
    
    if player_data.empty:
        return "No data found for the player or opponent."

    # Get mean values of features from previous performances against the opponent
    player_mean_stats = player_data[['goals', 'assists', 'total_tackles', 'accurate_passes', 'duels_won', 'minutes_played', 'position_encoded', 'team_encoded', 'opponent_encoded']].mean()

    # Reshape the data for prediction
    upcoming_match = pd.DataFrame(player_mean_stats).transpose()

    # Predict performance using Random Forest
    rf_pred = rf_model.predict(upcoming_match)
    
    # Predict performance using XGBoost
    xgb_pred = xgb_model.predict(upcoming_match)
    
    # Predict performance using Gradient Boosting Regressor (GBR)
    gbr_pred = gbr_model.predict(upcoming_match)
    
    # Ensemble Bagging: Take weighted average for Sofascore Rating, and average for other stats
    final_pred = [
        (rf_pred[0][0] + xgb_pred[0][0] + gbr_pred[0][0]) / 3,
        (rf_pred[0][1] + xgb_pred[0][1] + gbr_pred[0][1]) / 3,
        (rf_pred[0][2] + xgb_pred[0][2] + gbr_pred[0][2]) / 3,
        (rf_pred[0][3] + xgb_pred[0][3] + gbr_pred[0][3]) / 3,
        (rf_pred[0][4] + xgb_pred[0][4] + gbr_pred[0][4]) / 3,
        (rf_pred[0][5] + xgb_pred[0][5] + gbr_pred[0][5]) / 3
    ]

    # Return prediction values as JSON without field names
    for pred in final_pred:
        print(round(pred,2))
# Load player data (assuming it's already in the script or being loaded)
df = pd.DataFrame(player_stats)
# Example usage: take input from the user
if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python run_model.py <player_name> <opponent>")
        sys.exit(1)

    player_name = sys.argv[1]
    opponent = sys.argv[2]

    # Predict player performance and print the JSON result
    predict_player_performance(player_name, opponent, df, df)
    # print(prediction)
