from discord import app_commands
from discord.app_commands import Choice
from typing import List

def to_command_choices(
    choice_names: List[str], 
    choice_values: List[str] | None = None
) -> List[Choice]:
    result: List[Choice] = []
    if choice_values is None or len(choice_values) != 0 and len(choice_names) == len(choice_values):
        for choice_name in choice_names:
            result.append(app_commands.Choice(name=choice_name, value=choice_name))
    else:
        for choice in zip(choice_names, choice_values):
            result.append(app_commands.Choice(name=choice[0], value=choice[1]))
        
    return result