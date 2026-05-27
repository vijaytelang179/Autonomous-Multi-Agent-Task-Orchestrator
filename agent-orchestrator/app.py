from fastapi import FastAPI, HTTPException
from agents import Agent, create_agent, get_agent, list_agents

app = FastAPI(
    title="Agent Orchestrator",
    description="A simple backend for managing agents.",
    version="0.1.0",
)

@app.get("/", tags=["health"])
def root() -> dict:
    return {"status": "ok", "message": "Agent orchestrator backend is running."}

@app.get("/agents", tags=["agents"])
def read_agents() -> list[dict]:
    return [agent.dict() for agent in list_agents()]

@app.get("/agents/{agent_id}", tags=["agents"])
def read_agent(agent_id: str) -> dict:
    agent = get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent.dict()

@app.post("/agents", tags=["agents"])
def add_agent(name: str, role: str = "assistant") -> dict:
    agent = create_agent(name=name, role=role)
    return agent.dict()
