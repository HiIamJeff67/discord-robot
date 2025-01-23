def to_snake_case(string: str) -> str:
    """
        Translate the string to snake form, 
        e.g., MyString -> my_string
    """
    result = []
    for index, char in enumerate(string):
        if char.isupper():
            if index != 0:
                result.append("_")
            result.append(char.lower())
        else:
            result.append(char)
    
    return "".join(result)
