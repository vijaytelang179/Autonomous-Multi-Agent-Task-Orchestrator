import uuid
from typing import List, Optional
from pydantic import BaseModel

class Agent(BaseModel):
    id: str
    name: str
    role: str
    active: bool = True

agent_registry: List[Agent] = [
    Agent(id=str(uuid.uuid4()), name="default-agent", role="assistant"),
]

def list_agents() -> List[Agent]:
    return agent_registry


def get_agent(agent_id: str) -> Optional[Agent]:
    return next((agent for agent in agent_registry if agent.id == agent_id), None)


def create_agent(name: str, role: str = "assistant") -> Agent:
    agent = Agent(id=str(uuid.uuid4()), name=name, role=role)
    agent_registry.append(agent)
    return agent
