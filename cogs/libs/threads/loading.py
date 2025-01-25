import time
import asyncio

from typing import List
from threading import Event
from discord.interactions import InteractionMessage

from constants.limit import LoadingTimeLimitInterval

def loading_thread(
    frames: List[str], 
    bot: any, 
    message: InteractionMessage, 
    stop_event: Event, 
) -> None:
    i = 0
    n = len(frames)
    while not stop_event.is_set():
        frame = frames[i % n]
        asyncio.run_coroutine_threadsafe(
            message.edit(content=frame), 
            bot.loop
        )
        i = (i + 1) % n
        time.sleep(LoadingTimeLimitInterval)
    