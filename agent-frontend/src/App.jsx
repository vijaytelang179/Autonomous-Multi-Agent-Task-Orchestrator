// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [topic, setTopic] = useState('');
  const [logs, setLogs] = useState([]);
  const [finalReport, setFinalReport] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleStartOrchestrator = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLogs([]);
    setFinalReport('');
    setIsRunning(true);

    const url = `http://localhost:8080/api/run-agents?topic=${encodeURIComponent(topic)}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener('agent_update', (event) => {
      setLogs((prevLogs) => [...prevLogs, event.data]);
    });

    eventSource.addEventListener('final_result', (event) => {
      setFinalReport(event.data);
      setIsRunning(false);
      eventSource.close();
    });

    eventSource.addEventListener('error', () => {
      setLogs((prevLogs) => [...prevLogs, '❌ Connection broken or task failed.']);
      setIsRunning(false);
      eventSource.close();
    });
  };

  return (
    <div className="app-shell">
      <div className="hero-container">
        <section className="hero-card">
          <div className="hero-icon" aria-hidden="true">
            <span className="hero-icon-dot hero-icon-dot-1" />
            <span className="hero-icon-dot hero-icon-dot-2" />
            <span className="hero-icon-dot hero-icon-dot-3" />
            <span className="hero-icon-dot hero-icon-dot-4" />
          </div>
          <h1 className="hero-title">Ask away, Vijay!</h1>
          <p className="hero-copy">A smarter Gemini-style interface for agent orchestration and live research.</p>
        </section>

        <form className="hero-input-card" onSubmit={handleStartOrchestrator}>
          <button type="button" className="hero-icon-button" aria-label="New prompt">+</button>
          <input
            type="text"
            className="hero-input"
            placeholder="Ask Gemini"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isRunning}
          />
          <button type="submit" className="hero-submit-button" disabled={isRunning}>🎙</button>
        </form>

        {isRunning && <div className="hero-status-chip">Agents working... streaming logs below.</div>}

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <span className="status-dot" />
              Agent Collaboration Feed
            </div>
            <div className="panel-body">
              {logs.length === 0 ? (
                <p className="empty-state">No agents active. Enter a topic above to initialize workflow sequence.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="console-line">{log}</div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <span className="status-dot status-dot-muted" />
              Final Artifact Output
            </div>
            <div className="panel-body">
              {!finalReport && !isRunning ? (
                <p className="empty-state">The approved artifact layout will render here once verification seals complete.</p>
              ) : isRunning ? (
                <div className="loading-state">
                  <div className="loading-spinner" />
                  <p>Compiling research documentation insights...</p>
                </div>
              ) : (
                <pre className="output-pre">{finalReport}</pre>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
