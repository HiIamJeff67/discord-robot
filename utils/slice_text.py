def slice_text(text: str, length: int = 128):
    return text[:length] + ("..." if len(text) > length else "")