from langgraph.graph import StateGraph, END
from app.agents.state import AgentState

from app.agents.nodes.extract_node import extract_claim_node
from app.agents.nodes.search_node import web_search_node
from app.agents.nodes.trusted_db import trusted_db_node
from app.agents.nodes.agent1 import agent1_node
from app.agents.nodes.agent2 import agent2_node
from app.agents.nodes.debate_node import debate_node
from app.agents.nodes.moderator import moderator_node

def compile_workflow():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("extract_claim", extract_claim_node)
    workflow.add_node("web_search", web_search_node)
    workflow.add_node("db_search", trusted_db_node)
    workflow.add_node("agent1_optimist", agent1_node)
    workflow.add_node("agent2_skeptic", agent2_node)
    workflow.add_node("debate_room", debate_node)
    workflow.add_node("supreme_moderator", moderator_node)
    
    workflow.set_entry_point("extract_claim")

    workflow.add_edge("extract_claim", "web_search")
    workflow.add_edge("extract_claim", "db_search")

    workflow.add_edge(["web_search", "db_search"], "agent1_optimist")
    workflow.add_edge(["web_search", "db_search"], "agent2_skeptic")
    
    workflow.add_edge(["agent1_optimist", "agent2_skeptic"], "debate_room")
    
    workflow.add_edge("debate_room", "supreme_moderator")
    workflow.add_edge("supreme_moderator", END)

    return workflow.compile()

verification_graph = compile_workflow()