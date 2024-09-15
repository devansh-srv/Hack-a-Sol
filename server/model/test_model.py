import pandas as pd
import joblib
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
import xgboost as xgb
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error# Load data from the JSON file
with open('./final_cleaned.json') as file:
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

# Convert the list to a DataFrame
df = pd.DataFrame(player_stats)


# Encode categorical 'Position' and 'Team' into numerical values
le_position = LabelEncoder()
df['position_encoded'] = le_position.fit_transform(df['position'])

le_team = LabelEncoder()
df['team_encoded'] = le_team.fit_transform(df['team'])

le_opponent = LabelEncoder()
df['opponent_encoded'] = le_opponent.fit_transform(df['opponent'])


# Select features (X) and target (y)
X = df[['goals', 'assists', 'total_tackles', 'accurate_passes', 'duels_won', 'minutes_played', 'position_encoded', 'team_encoded', 'opponent_encoded']]

# Multi-output targets
y = df[['goals', 'assists', 'total_tackles', 'accurate_passes', 'duels_won', 'sofascore_rating']]



# Split the dataset into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Random Forest Regressor
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Train an XGBoost Regressor
xgb_model = xgb.XGBRegressor(objective ='reg:squarederror', n_estimators=100, seed=42)
xgb_model.fit(X_train, y_train)

#Train a GBR model
gbr_model = MultiOutputRegressor(GradientBoostingRegressor(n_estimators=100, random_state=42))
gbr_model.fit(X_train, y_train)

# Save the Random Forest, XGBoost, and Gradient Boosting Regressor models
joblib.dump(rf_model, 'rf_model.pkl')
joblib.dump(xgb_model, 'xgb_model.pkl')
joblib.dump(gbr_model, 'gbr_model.pkl')
