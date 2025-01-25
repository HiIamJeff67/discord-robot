import discord
import threading
from asyncpraw import Reddit

from cogs.libs.threads.loading import loading_thread
from cogs.libs.threads.fetch_reddit import *

from frames.fetch_post_loading_frames import fetch_post_loading_frames

async def fetch_reddit_news(
    bot: any, 
    reddit: Reddit, 
    interaction: discord.Interaction, 
) -> None:
    await interaction.response.send_message("Fetching the post...", ephemeral=False)
    message = await interaction.original_response()
    stop_event = threading.Event()
    
    _loading_thread = threading.Thread(
        target=loading_thread, 
        args=(fetch_post_loading_frames, bot, message, stop_event)
    )
    _loading_thread.start()
    
    embed = await fetch_reddit_news_thread(
        reddit=reddit, 
    )
    
    stop_event.set()
    _loading_thread.join()
    
    if embed:
        await interaction.edit_original_response(content=None, embed=embed)
    else:
        await interaction.edit_original_response(content="No suitable news found.")
    
    
    
async def fetch_reddit_meme(
    bot: any, 
    reddit: Reddit, 
    interaction: discord.Interaction, 
) -> None:
    await interaction.response.send_message("Fetching the post...", ephemeral=False)
    message = await interaction.original_response()
    stop_event = threading.Event()
    
    _loading_thread = threading.Thread(
        target=loading_thread, 
        args=(fetch_post_loading_frames, bot, message, stop_event)
    )
    _loading_thread.start()
    
    embed = await fetch_reddit_meme_thread(
        reddit=reddit, 
    )
    
    stop_event.set()
    _loading_thread.join()
    
    if embed:
        await interaction.edit_original_response(content=None, embed=embed)
    else:
        await interaction.edit_original_response(content="No suitable memes found.")



async def fetch_reddit_post(
    bot: any, 
    reddit: Reddit, 
    interaction: discord.Interaction, 
) -> None:
    await interaction.response.send_message("Fetching the post...", ephemeral=False)
    message = await interaction.original_response()
    stop_event = threading.Event()
    
    _loading_thread = threading.Thread(
        target=loading_thread, 
        args=(fetch_post_loading_frames, bot, message, stop_event)
    )
    _loading_thread.start()
    
    embed = await fetch_reddit_post_thread(
        reddit=reddit, 
    )
    
    stop_event.set()
    _loading_thread.join()
    
    if embed:
        await interaction.edit_original_response(content=None, embed=embed)
    else:
        await interaction.edit_original_response(content="No suitable posts found.")
