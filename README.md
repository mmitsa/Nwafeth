# 🏢 نوافذ العقارية (Nawafiz Real Estate Platform) - MVP

[![Version](https://img.shields.io/badge/version-1.1.0--beta-brand)](https://github.com/your-repo)
[![AI-Core](https://img.shields.io/badge/AI--Engine-Python-green)](api/nawafiz_ai.py)
[![Frontend](https://img.shields.io/badge/UI-React%2019-blue)](https://react.dev/)

**Nawafiz (نوافذ)** is an AI-driven real estate ecosystem utilizing a high-performance **Python AI Backend** integrated with a modern **React 19 Frontend**.

---

## 🏗️ Technical Architecture

The platform follows a decoupled architecture:
1.  **AI Algorithmic Layer (Python)**: Handles deep market analysis, valuation modeling, and investment matching using the `google-genai` Python SDK.
2.  **User Interface Layer (TypeScript/React)**: Delivers a responsive, real-time experience for brokers, developers, and investors.
3.  **Bridge Gateway**: The `geminiService.ts` serves as the interface between the web client and the Python intelligence engine.

---

## 🧠 Python AI Engines (`api/nawafiz_ai.py`)

| Engine | Technology | Role |
| :--- | :--- | :--- |
| **Valuation Algorithm** | Python + Pydantic | Multi-variable appraisal based on transaction history and urban growth metrics. |
| **Matching Logic** | Python Logic | Financial goal alignment for HNW investors. |
| **Market Advisor** | Python SDK | Natural language processing for KSA real estate regulations and trends. |

---

## 🛡️ Legal & Compliance Logic

Aligned with **REGA (Real Estate General Authority)** standards:
*   **FAL License Validation**: Mandatory for all brokers.
*   **E-Contracting**: Automated generation of Type A, B, and C contracts.
*   **Lead Protection**: Programmatic 60-day vault to ensure commission rights.

---

## 🏗️ Getting Started

### Prerequisites
*   Node.js 18+ (Frontend)
*   Python 3.10+ (AI Backend)
*   Google Gemini API Key (set in environment)

### Installation
```bash
# Install Python dependencies
pip install google-genai pydantic

# Install Node dependencies
npm install

# Start development
npm run dev
```

---
**Nawafiz** — *Saudi Intelligence. Real Estate Trust.*