import os
import asyncpraw as praw
from discord import app_commands
from discord.ext import commands

from discord import Interaction
from discord.app_commands import Choice
from cogs.types.Media import ValidMediaSourceType, ValidMediaSourceTypes
from utils.to_command_choices import to_command_choices

from cogs.libs.reddit_fetcher import fetch_reddit_news, fetch_reddit_meme, fetch_reddit_post

class MediaFetcherCog(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.reddit = praw.Reddit(
            client_id=os.getenv("REDDIT_CLIENT_ID"), 
            client_secret=os.getenv("REDDIT_CLIENT_SECRET"), 
            user_agent=os.getenv("REDDIT_USER_AGENT"), 
        )

    @commands.Cog.listener()
    async def on_ready(self):
        print("Cog of MediaFetcher is loaded successfully --- ✅")
        
    @app_commands.command(name="news", description="Get a random news from the specified media")
    @app_commands.describe(source="Choose the below media as the source of the news (default to be Reddit)")
    @app_commands.choices(source=to_command_choices(ValidMediaSourceTypes))
    async def get_news(
        self, 
        interaction: Interaction, 
        source: Choice[str] | None, 
    ):
        try:
            if source == "Reddit":
                await fetch_reddit_news(self.bot, self.reddit, interaction)
            elif source == "Facebook":
                pass
            elif source == "Instagram":
                pass
            elif source == "X":
                pass
            else:
                await fetch_reddit_news(self.bot, self.reddit, interaction)
            
        except Exception as error:
            print(error)



    @app_commands.command(name="meme", description="Get a random meme from the specified media")
    @app_commands.describe(source="Choose the below media as the source of the news (default to be Reddit)")
    @app_commands.choices(source=to_command_choices(ValidMediaSourceTypes))
    async def get_meme(
        self, 
        interaction: Interaction, 
        source: Choice[str] | None, 
    ):
        try:
            if source == "Reddit":
                await fetch_reddit_meme(self.bot, self.reddit, interaction)
            elif source == "Facebook":
                pass
            elif source == "Instagram":
                pass
            elif source == "X":
                pass
            else:
                await fetch_reddit_meme(self.bot, self.reddit, interaction)
            
        except Exception as error:
            print(error)



    @app_commands.command(name="post", description="Get a random post from the specified media")
    @app_commands.describe(source="Choose the below media as the source of the news (default to be Reddit)")
    @app_commands.choices(source=to_command_choices(ValidMediaSourceTypes))
    async def get_post(
        self, 
        interaction: Interaction, 
        source: Choice[str] | None, 
    ):
        try:
            if source == "Reddit":
                await fetch_reddit_post(self.bot, self.reddit, interaction)
            elif source == "Facebook":
                pass
            elif source == "Instagram":
                pass
            elif source == "X":
                pass
            else:
                await fetch_reddit_post(self.bot, self.reddit, interaction)
            
        except Exception as error:
            print(error)

async def setup(bot):
    await bot.add_cog(MediaFetcherCog(bot))