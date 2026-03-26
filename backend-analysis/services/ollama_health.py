# services/ollama_health.py
import requests
import logging

logger = logging.getLogger(__name__)

def check_ollama_running() -> bool:
    """
    Verify if Ollama is running on localhost.
    """
    try:
        # Ollama default port is 11434
        response = requests.get("http://localhost:11434", timeout=2)
        if response.status_code == 200:
            logger.info("Ollama is running.")
            return True
        else:
            logger.warning(f"Ollama returned status code {response.status_code}")
            return False
    except requests.exceptions.RequestException:
        logger.warning("Ollama is NOT running. Connection failed to http://localhost:11434")
        return False
