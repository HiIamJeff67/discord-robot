from typing import TypedDict, NotRequired

class PostDataInterface(TypedDict):
    title: str
    main_url: str
    score: int
    num_of_comments: int
    created_at: int
    thumbnail: str
    self_text: NotRequired[str]
    author_name: NotRequired[str]
    author_icon_url: NotRequired[str]

    