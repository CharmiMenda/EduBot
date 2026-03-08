import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage

from rag.pipeline import get_vector_store
from rag.prompts import build_chat_prompt

# Setup LLM
# In production, ensure OPENAI_API_KEY is in the environment
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2)

def generate_answer(query: str, history: list, weak_areas: list = None) -> dict:
    """
    Retrieves context and generates answer using LangChain and OpenAI.
    """
    if weak_areas is None:
        weak_areas = []

    # 1. Retrieve Context
    db = get_vector_store()
    
    # We retrieve top 4 most relevant chunks
    docs = db.similarity_search(query, k=4)
    
    context_str = "\n\n".join([f"Source ({doc.metadata.get('source_type', 'unknown')}): {doc.metadata.get('title', 'Untitled')}\nContent: {doc.page_content}" for doc in docs])
    
    # Track recommendations
    recommended_mat_ids = []
    recommended_quiz_ids = []
    
    for doc in docs:
        if doc.metadata.get("source_type") == "preparation_material" and doc.metadata.get("id"):
            recommended_mat_ids.append(doc.metadata.get("id"))
        elif doc.metadata.get("source_type") == "quiz" and doc.metadata.get("id"):
            recommended_quiz_ids.append(doc.metadata.get("id"))

    # Remove duplicates
    recommended_mat_ids = list(set(recommended_mat_ids))
    recommended_quiz_ids = list(set(recommended_quiz_ids))
    
    # 2. Format History
    formatted_history = []
    for msg in history:
        if msg["role"] == "user":
            formatted_history.append(HumanMessage(content=msg["content"]))
        else:
            formatted_history.append(AIMessage(content=msg["content"]))
            
    # Keep only last 5 exchanges to manage context window
    formatted_history = formatted_history[-10:]

    # 3. Generate Answer
    prompt = build_chat_prompt()
    chain = prompt | llm
    
    response = chain.invoke({
        "context": context_str,
        "weak_areas": ", ".join(weak_areas) if weak_areas else "None",
        "history": formatted_history,
        "question": query
    })
    
    return {
        "answer": response.content,
        "recommended_materials_ids": recommended_mat_ids,
        "recommended_quizzes_ids": recommended_quiz_ids
    }
