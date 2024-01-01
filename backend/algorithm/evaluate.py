import json
import sys
from sklearn.neural_network import MLPClassifier # scikit-learn
import numpy as np # numpy
import pandas as pd # pandas
from collections import defaultdict

GENRE_LABELS = [28, 12, 16, 35, 80, 99, 18, 10571, 14, 36, 27, 10402, 9648, 10749, 878, 10770]

def parse_rated_movies(file_name):
    # read in data
    with open(file_name) as f:
        data = json.load(f)

    # create the input/output vectors
    x, y = [], []

    # parse the data
    for d in data.keys():
        # filter likes
        if d=="Like":
            movie_list = data[d]
            for movie in movie_list:
                x.append(movie.values())
                y.append(1)
        # filter dislikes
        elif d=="Dislike":
            movie_list = data[d]
            for movie in movie_list:
                x.append(movie.values())
                y.append(0)

    # return the built dataset
    df = pd.DataFrame(x, columns=data["Like"][0])
    return df, y


def parse_test_movies(file_name):
    # read in data
    with open(file_name) as f:
        data = json.load(f)
    
    # return the built dataset
    df = pd.DataFrame([movie.values() for movie in data], columns=data[0].keys())
    return df

def encode_genre(df):
    # encode the category in dataframe
    for label in GENRE_LABELS:
        df.insert(0, f"genre_{label}", [1 if label in x else 0 for x in df["genre_ids"]], True)

    # export final updated dataframe
    return df

def convert_release_date_to_year(df):
    # extract year from release date
    df["release_date"] = df.apply(lambda row : int(row["release_date"].partition("-")[0]), axis=1)

    # export final updated dataframe
    return df

def train_model(df, results):
    # create multi-layer perceptron classifier
    model = MLPClassifier(hidden_layer_sizes=(len(df),),
                          alpha=0.01,
                          solver="lbfgs",
                          activation="logistic",
                          learning_rate="constant",
                          learning_rate_init=.001,
                          max_iter=2000,
                          random_state=0)
    model = model.fit(df.iloc[:,1:], results)
    return model


# USAGE: python3 evaluate.py <data_file_name> <test_file_name>
if __name__=="__main__":
    # load args
    path = sys.argv[0].partition("evaluate.py")[0]
    data_file_name = path+sys.argv[1]
    test_file_name = path+sys.argv[2] # contains the movies to rank

    # create raw training dataset
    data_x, data_y = parse_rated_movies(data_file_name)

    # prepare training set
    data_x = encode_genre(data_x)
    data_x = convert_release_date_to_year(data_x)

    # train model
    movie_model = train_model(data_x.drop(columns=["title", "genre_ids"]), data_y)

    # create testing dataset
    test_x = parse_test_movies(test_file_name)

    # prepare testing set
    test_x = encode_genre(test_x)
    test_x = convert_release_date_to_year(test_x)  

    # rank movies
    probs = movie_model.predict_proba(test_x.drop(columns=["title", "genre_ids"]).iloc[:,1:])
    test_x.insert(0, "probability", [prob[1] for prob in probs])

    # export results to results.json
    with open(path+"results.json", "w") as writer:
        final_df = test_x.sort_values(by="probability", axis=0, ascending=False)
        final_df = final_df.drop(columns=["probability"]+[f"genre_{l}" for l in GENRE_LABELS])
        writer.write(final_df.to_json(orient="records"))
    
