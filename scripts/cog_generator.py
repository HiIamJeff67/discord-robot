import os
import argparse

from scripts.types.IsSlashCommandType import IsSlashCommandType, IsSlashCommandTypes
from utils.to_snake_case import to_snake_case

BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # get the path of current directory
NORMAL_TEMPLATE_PATH = os.path.join(BASE_DIR, "templates", "template_of_normal_cog.txt")
NORMAL_WITHOUT_COMMAND_TEMPLATE_PATH = os.path.join(BASE_DIR, "templates", "template_of_normal_cog_without_command.txt")
SLASH_TEMPLATE_PATH = os.path.join(BASE_DIR, "templates", "template_of_slash_cog.txt")
SLASH_WITHOUT_COMMAND_TEMPLATE_PATH = os.path.join(BASE_DIR, "templates", "template_of_slash_cog_without_command.txt")
COGS_DIR = "./cogs"

def create_cog(class_name: str, init_command_name: str | None = None, isSlashCommand: IsSlashCommandType | None = None):
    if isSlashCommand is None: 
        isSlashCommand = "True"
    elif isSlashCommand not in IsSlashCommandTypes:
        print(f"The args of isSlashCommand should be within: {IsSlashCommandTypes}")
        return
    
    os.makedirs(COGS_DIR, exist_ok=True)
    
    file_name = f"{to_snake_case(class_name)}.py"
    file_path = os.path.join(COGS_DIR, file_name)
    
    if os.path.exists(file_path):
        print(f"Same file already exist in {file_path}")
        return
    
    if isSlashCommand == "False":
        if not os.path.exists(NORMAL_TEMPLATE_PATH) or not os.path.exists(NORMAL_WITHOUT_COMMAND_TEMPLATE_PATH):
            print(f"Template file not found in {NORMAL_TEMPLATE_PATH}")
            return
        
        if init_command_name is None:
            with open(NORMAL_WITHOUT_COMMAND_TEMPLATE_PATH, "r") as template_file:
                content = template_file.read()
                content = content.replace("{class_name_placeholder}", class_name)
        else:
            with open(NORMAL_TEMPLATE_PATH, "r") as template_file:
                content = template_file.read()
                content = content.replace("{class_name_placeholder}", class_name)
                content = content.replace("{init_command_name_placeholder}", init_command_name)
        
        with open(file_path, "w") as cog_file:
            cog_file.write(content)
        
        print(f"✅ Successfully generated cog '{class_name}' at '{file_path}'")
        
    elif isSlashCommand == "True":
        if not os.path.exists(SLASH_TEMPLATE_PATH) or not os.path.exists(SLASH_WITHOUT_COMMAND_TEMPLATE_PATH):
            print(f"Template file not found in {SLASH_TEMPLATE_PATH}")
            return

        if init_command_name is None:
            with open(SLASH_WITHOUT_COMMAND_TEMPLATE_PATH, "r") as template_file:
                content = template_file.read()
                content = content.replace("{class_name_placeholder}", class_name)
        else:
            with open(SLASH_TEMPLATE_PATH, "r") as template_file:
                content = template_file.read()
                content = content.replace("{class_name_placeholder}", class_name)
                content = content.replace("{init_command_name_placeholder}", init_command_name)
            
        with open(file_path, "w") as cog_file:
            cog_file.write(content)
        
        print(f"✅ Successfully generated cog '{class_name}' at '{file_path}'")
    
def main():
    parser = argparse.ArgumentParser(
        description="Generate a new cog file for the Discord bot."
    )
    
    parser.add_argument(
        "-c", "--class", 
        dest="class_name", 
        type=str, 
        required=True, 
        help="The class name for the new cog (e.g., 'my_cat')", 
    )
    parser.add_argument(
        "-cmd", "--command", 
        dest="command_name", 
        type=str, 
        required=False, 
        help="The command name for the new cog (e.g., 'my_command')", 
    )
    parser.add_argument(
        "-s", "--slash", 
        dest="slash", 
        type=str, 
        required=False, 
        help="The value to control whether it is a slash command (should be either 'True' or 'False')", 
    )
    
    args = parser.parse_args()
    
    create_cog(args.class_name, args.command_name, args.slash)
    
if __name__ == "__main__":
    main()