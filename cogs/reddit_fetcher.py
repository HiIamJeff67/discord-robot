import os
import random
import asyncpraw as praw
import discord
from discord import app_commands
from discord.ext import commands

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
        subreddit = await self.reddit.subreddit("news")
        posts_list = []
        
        async for post in subreddit.new(limit=30):
            if not post.over_18 and any(post.url.endwith(ext for ext in [".png", ".jpg", ".jpeg", ".gif"])):
                author_name = "N/A" if post.author is None else post.author.name
                posts_list.append((post.url, author_name))
        
        if posts_list:
            random_post = random.choice(posts_list)
            
    
    @app_commands.command(name="meme", description="Get a random meme from Reddit.")
    async def get_reddit_meme(self, interaction: discord.Interaction):
        view = PostView()
        await interaction.response.send_message("Click the button to get a meme!", view=view)
    
    @app_commands.command(name="post", description="Get a random post from Reddit.")
    @app_commands.describe(about="Input the topic of the post you'd like to see (optional).")
    async def get_reddit_post(self, interaction: discord.Interaction, about: str | None = None):
        pass
    

async def setup(bot):
    await bot.add_cog(RedditFetcherCog(bot))