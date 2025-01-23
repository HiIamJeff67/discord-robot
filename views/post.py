import discord
from discord.ui import View, Button

class PostView(View):
    def __init__(self):
        super().__init__(timeout=None)
    
    @discord.ui.button(label="Click me!", style=discord.ButtonStyle.green)
    async def button_callback(self, interaction: discord.Interaction, button: Button):
        await interaction.response.send_message("Yoooooo!", ephemeral=True)

    
