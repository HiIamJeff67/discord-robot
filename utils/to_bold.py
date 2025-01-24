def to_bold(text: str) -> str:
    return ("" if text.startswith("**") else "**") + text + ("" if text.endswith("**") else "**")