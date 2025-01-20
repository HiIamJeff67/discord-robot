import os
import asyncio
from dotenv import load_dotenv
import discord
from discord.ext import commands

load_dotenv()

bot = commands.Bot(command_prefix='.', intents=discord.Intents.all())

@bot.event
async def on_ready():
    print("Jyuna is ready...")
    
@bot.command(name="hello")
async def hello(ctx):
    await ctx.send(f"Hello there, {ctx.author.mention}")
    
@bot.command(name="getLatency")
async def getLatency(ctx):
    latency_embed = discord.Embed(title="Latency", description="Latency in ms", color=discord.Color.blue())
    latency_embed.add_field(name=f"{bot.user.name}'s latency(ms):", value=f"{round(bot.latency * 1000)} ms", inline=True)
    latency_embed.set_footer(text=f"Requested by {ctx.author.name}", icon_url=ctx.author.avatar)
    await ctx.send(embed=latency_embed)

bot.run(os.getenv("DISCORD_BOT_TOKEN"))