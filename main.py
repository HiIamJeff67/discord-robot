import os
import asyncio
from dotenv import load_dotenv
import discord
from discord.ext import commands

load_dotenv()
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='.', intents=discord.Intents.all())

@bot.event
async def on_ready():
    try:
        synced_commands = await bot.tree.sync()
        print(f"Synced {len(synced_commands)} commands")
    except Exception as error:
        print(f"An unexcpeted error occurred while syncing application commands: {error}")
    
    print(f"Invite the bot from here: {os.getenv("DISCORD_BOT_INVITE_URL")}")
    print("Jyuna is ready...")
    
async def LoadCogs():
    for fileName in os.listdir("./cogs"):
        if fileName.endswith(".py") and fileName != "__init__.py":
            await bot.load_extension(f"cogs.{fileName[:-3]}")

async def main():
    async with bot:
        await LoadCogs()
        await bot.start(os.getenv("DISCORD_BOT_TOKEN"))

asyncio.run(main())