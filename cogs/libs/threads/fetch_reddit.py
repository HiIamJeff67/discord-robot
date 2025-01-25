import os
import random
import discord
from datetime import datetime

from typing import List
from asyncpraw import Reddit
from discord import Embed
from cogs.interfaces.PostDataInterface import PostDataInterface
from cogs.types.PhotoType import PhotoTypes

from utils.is_not_empty import is_not_empty_string
from utils.to_bold import to_bold
from utils.check_and_to_reddit_url import check_and_to_reddit_url
from utils.slice_text import slice_text
from utils.get_random_reddit_url import get_random_reddit_url

async def fetch_reddit_news_thread(reddit: Reddit) -> Embed | None:
    subreddit = await reddit.subreddit("news")
    posts_list: List[PostDataInterface] = []
    
    async for post in subreddit.new(limit=30):
        if not post.over_18:
            if post.author is None:
                author_name = "N/A"
                author_icon_url = get_random_reddit_url()
            else:
                author_name = post.author.name
                author_icon_url = getattr(post.author, "icon_img", get_random_reddit_url())
            
            created_time = datetime.utcfromtimestamp(post.created_utc).strftime("%Y-%m-%d %H:%M:%S")
            posts_list.append(
                {
                    "title": post.title, 
                    "main_url": check_and_to_reddit_url(post.url), 
                    "score": post.score, 
                    "num_of_comments": post.num_comments, 
                    "created_at": created_time, 
                    "thumbnail": post.thumbnail, 
                    "self_text": post.selftext, 
                    "author_name": author_name, 
                    "author_icon_url": author_icon_url, 
                }
            )
        
    if posts_list:
        random_post = random.choice(posts_list)

        embed = discord.Embed(
            title=random_post['title'],
            url=random_post['main_url'],
            description=f"{to_bold("Score:")} {random_post['score']} | {to_bold("Comments:")} {random_post['num_of_comments']}",
            color=discord.Color.blue(),
        )
        embed.set_author(name=random_post['author_name'], icon_url=random_post['author_icon_url'])
        if is_not_empty_string(random_post["self_text"]): 
            embed.add_field(name=f"{to_bold("Self Text:")}", value=f"{slice_text(random_post['self_text'])}")
        embed.set_footer(text=f"Created: {random_post['created_at']}")
        
        return embed
    
    return None



async def fetch_reddit_meme_thread(reddit: Reddit) -> Embed | None:
    subreddit = await reddit.subreddit("meme")
    posts_list: List[PostDataInterface] = []
    
    async for post in subreddit.new(limit=30):
        if not post.over_18 and any(post.url.endswith(ext) for ext in PhotoTypes):
            if post.author is None:
                author_name = "N/A"
                author_icon_url = get_random_reddit_url()
            else:
                author_name = post.author.name
                author_icon_url = getattr(post.author, "icon_img", get_random_reddit_url())
            
            created_time = datetime.utcfromtimestamp(post.created_utc).strftime("%Y-%m-%d %H:%M:%S")
            posts_list.append(
                {
                    "title": post.title, 
                    "main_url": check_and_to_reddit_url(post.url), 
                    "score": post.score, 
                    "num_of_comments": post.num_comments, 
                    "created_at": created_time, 
                    "thumbnail": post.thumbnail, 
                    "self_text": post.selftext, 
                    "author_name": author_name, 
                    "author_icon_url": author_icon_url, 
                }
            )
        
    if posts_list:
        random_post = random.choice(posts_list)

        embed = discord.Embed(
            title=random_post['title'],
            url=random_post['main_url'],
            description=f"{to_bold("Score:")} {random_post['score']} | {to_bold("Comments:")} {random_post['num_of_comments']}",
            color=discord.Color.blue(),
        )
        embed.set_author(name=random_post['author_name'], icon_url=random_post['author_icon_url'])
        embed.set_image(url=random_post['main_url'])
        if is_not_empty_string(random_post["self_text"]): 
            embed.add_field(name=f"{to_bold("Self Text:")}", value=f"{slice_text(random_post['self_text'])}")
        embed.set_footer(text=f"Created: {random_post['created_at']}")
        
        return embed
    
    return None



async def fetch_reddit_post_thread(reddit: Reddit, topic: str) -> Embed | None:
    subreddit = await reddit.subreddit(topic)
    posts_list: List[PostDataInterface] = []
    
    async for post in subreddit.hot(limit=30):
        if not post.over_18:
            if post.author is None:
                author_name = "N/A"
                author_icon_url = get_random_reddit_url()
            else:
                author_name = post.author.name
                author_icon_url = getattr(post.author, "icon_img", get_random_reddit_url())
            
            created_time = datetime.utcfromtimestamp(post.created_utc).strftime("%Y-%m-%d %H:%M:%S")
            posts_list.append(
                {
                    "title": post.title, 
                    "main_url": check_and_to_reddit_url(post.url), 
                    "score": post.score, 
                    "num_of_comments": post.num_comments, 
                    "created_at": created_time, 
                    "thumbnail": post.thumbnail, 
                    "self_text": post.selftext, 
                    "author_name": author_name, 
                    "author_icon_url": author_icon_url, 
                }
            )
    
    if posts_list:
        random_post = random.choice(posts_list)

        embed = discord.Embed(
            title=random_post['title'],
            url=random_post['main_url'],
            description=f"{to_bold("Score:")} {random_post['score']} | {to_bold("Comments:")} {random_post['num_of_comments']}",
            color=discord.Color.blue(),
        )
        embed.set_author(name=random_post['author_name'], icon_url=random_post['author_icon_url'])
        if any(random_post["main_url"].endswith(ext) for ext in PhotoTypes):
            embed.set_image(url=random_post['main_url'])
        if is_not_empty_string(random_post["self_text"]):
            embed.add_field(name=f"{to_bold("Self Text:")}", value=f"{slice_text(random_post['self_text'])}")
        embed.set_footer(text=f"Created: {random_post['created_at']}")
        
        return embed

    return None
