import random
from constants.reddit import DefaultRedditAvatarFloor, DefaultRedditAvatarCeil, DefaultRedditAvatarUrlTemplate

def get_random_reddit_url() -> str:
    return DefaultRedditAvatarUrlTemplate + str(random.randint(DefaultRedditAvatarFloor, DefaultRedditAvatarCeil)) + ".png"