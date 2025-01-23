import sys
import os

scripts_dir = os.path.join(os.path.dirname(__file__), "scripts")
sys.path.insert(0, scripts_dir)

import scripts.cog_generator as cog_generator

if __name__ == "__main__":
    cog_generator.main()