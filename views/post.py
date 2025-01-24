import random
from datetime import datetime
import discord
from discord.ui import View, Button

from typing import List
from utils.is_not_empty import is_not_empty_string
from cogs.interfaces.PostDataInterface import PostDataInterface

class PostView(View):
    def __init__(self):
        super().__init__(timeout=None)
    
    @discord.ui.button(label="One more", style=discord.ButtonStyle.green)
    async def button_callback(self, interaction: discord.Interaction, button: Button):
        pass
        
    

    
