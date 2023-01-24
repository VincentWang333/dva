import pandas as pd

if __name__ == '__main__':
    df = pd.read_csv('popular_board_game.csv', index_col='name', usecols=['name', 'category', 'playtime', 'playtime_num', 'avg_rating', 'num_ratings', 'min_players'])

    for row in df.iterrows():
        print(row)
        break
    