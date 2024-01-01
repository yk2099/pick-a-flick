import requests
import json
import sys

# parse args
path = sys.argv[0].partition("random_batch.py")[0]
page_num = sys.argv[1] if len(sys.argv) > 1 else 1

# request most popular movies
req = requests.get(f"https://api.themoviedb.org/3/discover/movie?api_key=26a91d7ed31857a2aaea9cc746a31703&language=en-US&region=US&sort_by=popularity.desc&include_adult=false&include_video=false&page={page_num}&with_watch_monetization_types=flatrate")
req_lst = req.json()["results"]

# discard irrelevant fields
rem_list = ["title", "vote_average", "popularity", "release_date", "genre_ids"]
movie_lst = []
for movie in req_lst:
    movie_lst.append({key: movie[key] for key in movie if key in rem_list})
    


with open(path+"auto.json", "w") as out:
    out.write(json.dumps(movie_lst))
# for movie in lst["results"]:
#     print(l)