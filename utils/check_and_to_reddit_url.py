def check_and_to_reddit_url(url: str):
    return ("https://reddit.com" if url.startswith("/r/") else "") + url