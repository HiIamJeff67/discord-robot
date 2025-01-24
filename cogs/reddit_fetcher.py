import os
import random
from datetime import datetime
import asyncpraw as praw
import discord
from discord import app_commands
from discord.ext import commands

from typing import List
from cogs.interfaces.PostDataInterface import PostDataInterface
from cogs.types.PhotoType import PhotoType, PhotoTypes
from utils.is_not_empty import is_not_empty_string
from utils.to_bold import to_bold
from utils.check_and_to_reddit_url import check_and_to_reddit_url
from utils.slice_text import slice_text
from views.post import PostView

class RedditFetcherCog(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.reddit = praw.Reddit(
            client_id=os.getenv("REDDIT_CLIENT_ID"), 
            client_secret=os.getenv("REDDIT_CLIENT_SECRET"), 
            user_agent=os.getenv("REDDIT_USER_AGENT"), 
        )

    @commands.Cog.listener()
    async def on_ready(self):
        print("Cog of RedditFetcher is loaded successfully --- ✅")
        
    @app_commands.command(name="news", description="Get a random news from Reddit.")
    async def get_reddit_news(self, interaction: discord.Interaction):
        try:
            subreddit = await self.reddit.subreddit("news")
            posts_list: List[PostDataInterface] = []
            
            async for post in subreddit.new(limit=30):
                if not post.over_18:
                    if post.author is None:
                        author_name = "N/A"
                        author_icon_url = "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png"
                    else:
                        author_name = post.author.name
                        author_icon_url = getattr(post.author, "icon_img", "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png")
                    
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
                
                await interaction.response.send_message(embed=embed)
            else:
                await interaction.response.send_message("No suitable news found.")
        except Exception as error:
            print(error)
    
    
    
    @app_commands.command(name="meme", description="Get a random meme from Reddit.")
    async def get_reddit_meme(self, interaction: discord.Interaction):
        try:
            subreddit = await self.reddit.subreddit("meme")
            posts_list: List[PostDataInterface] = []
            
            async for post in subreddit.hot(limit=100):
                if not post.over_18 and any(post.url.endswith(ext) for ext in PhotoTypes):
                    if post.author is None:
                        author_name = "N/A"
                        author_icon_url = "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png"
                    else:
                        author_name = post.author.name
                        author_icon_url = getattr(post.author, "icon_img", "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png")
                    
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
                
                await interaction.response.send_message(embed=embed)
            else:
                await interaction.response.send_message("No suitable news found.")
        except Exception as error:
            print(error)
    
    
    
    @app_commands.command(name="post", description="Get a random post from Reddit.")
    @app_commands.describe(topic="Input the topic of the post you'd like to see (optional).")
    async def get_reddit_post(self, interaction: discord.Interaction, topic: str | None = None):
        await interaction.response.defer()  # tell discord we need more time to fetch the data
        try:
            if topic is None: topic = "funny"
            subreddit = await self.reddit.subreddit(topic)
            posts_list: List[PostDataInterface] = []
            
            async for post in subreddit.hot(limit=100):
                if not post.over_18:
                    if post.author is None:
                        author_name = "N/A"
                        author_icon_url = "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png"
                    else:
                        author_name = post.author.name
                        author_icon_url = getattr(post.author, "icon_img", "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png")
                    
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
                
                await interaction.followup.send(embed=embed)
            else:
                await interaction.followup.send("No suitable news found.")
        except Exception as error:
            print(error)
    
    
    
async def setup(bot):
    await bot.add_cog(RedditFetcherCog(bot))