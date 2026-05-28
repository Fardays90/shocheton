import pymupdf
import pymupdf4llm
import tiktoken

def get_tokens(text:str) -> list[int]:
    model = "gpt-4o-mini"
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("o200k_base")
    return encoding.encode(text)

def decode_tokens(tokens: list[int]) -> str:
    model = "gpt-4o-mini"
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("o200k_base")
    return encoding.decode(tokens)

def truncate(text:str) -> str:
    limit = 60000
    tokens = get_tokens(text)
    if len(tokens) <= limit:
        return text
    
    halved = limit // 2
    first_part = tokens[:halved]
    second_part = tokens[-halved:] 
    first_str = decode_tokens(first_part)
    second_str = decode_tokens(second_part)
    final_str = "First part: \n" + first_str + "\n Second Part: \n" + second_str
    return final_str

def pdf_to_md(file_bytes: bytes) -> str:
    doc = pymupdf.open(stream= file_bytes, filetype="pdf")
    md = pymupdf4llm.to_markdown(doc)
    slimmed = truncate(md)
    return slimmed
