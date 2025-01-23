import discord
from discord import app_commands
from discord.ext import commands

class SettingsCog(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @commands.Cog.listener()
    async def on_ready(self):
        pass
    
    @app_commands.command(name="help", description="Get the instructions of Jyuna.")
    async def help(self, ctx):
        pass
    
    @app_commands.command(name="ping", description="Get the latency of Jyuna.")
    async def getLatency(self, interaction: discord.Interaction):
        latency_embed = discord.Embed(
            title="Latency", 
            description="Latency in ms", 
            color=discord.Color.blue()
        )
        latency_embed.add_field(
            name=f"{self.bot.user.name}'s latency(ms):", 
            value=f"{round(self.bot.latency * 1000)} ms", 
            inline=True
        )
        latency_embed.set_footer(
            text=f"Requested by {interaction.user.name}", 
            icon_url=interaction.user.avatar
        )
        await interaction.response.send_message(embed=latency_embed)

async def setup(bot):
    await bot.add_cog(SettingsCog(bot))
