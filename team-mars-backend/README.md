# 🧱 FastAPI Backend — Clean Architecture

A backend service built using **FastAPI** and structured according to **Clean Architecture** principles. This serves as the foundational setup for scalable, testable, and maintainable backend development.

---


## 🧭 Overview

This project separates business logic, domain models, and infrastructure concerns to enforce strict boundaries and modularity. 

> **Rule:** Source code dependencies must always point inward — inner layers must not depend on outer layers.

---

## 📁 Directory Structure

```
backend/
├── aws/
├── constants/
├── controller/          # API route handlers (entrypoints)
├── external_gateway/    # External service calls (e.g., Supabase, AWS)
├── functions/           # Reusable business functions
├── model/               # Domain models and entities
├── repository/          # Data access interfaces and implementations

├── resources/           # Static files, seeds, etc.
├── scripts/             # Maintenance and dev scripts
├── usecase/             # Application logic (business rules)

├── utils/               # Helpers, validators, logging utils
│
├── main.py              # FastAPI entrypoint
├── requirements.txt
├── pyproject.toml
├── .gitignore

├── .python-version
├── .pre-commit-config.yaml
├── .secrets.baseline
├── README.md
└── uv.lock

```

---

## ⚙️ Setup Local Environment

### 1. Pre-requisites

* Python 3.11 or later
* Located in the `backend/` directory

### 2. Install uv

```bash
# Follow the installation guide:
# https://docs.astral.sh/uv/getting-started/installation/
```


### 3. Create Virtual Environment


```bash
uv venv
```

### 4. Install Dependencies


```bash
uv sync
```

### 5. Activate Environment

```bash

# Windows
.venv\Scripts\activate


# Linux/Mac
source .venv/bin/activate

```

### 6. Add Environment Variables

Create a `.env` file in the `backend/` directory with required configuration values such as database credentials and API keys.

Example `.env`:

```
APP_NAME=FastAPI_Backend
ENV=development

PORT=8000

DATABASE_URL=postgresql://user:password@localhost:5432/app_db
```

---


## ▶️ Running Locally

### 1. Activate Environment

```bash
source .venv/bin/activate
```

### 2. Start Server

```bash
uvicorn main:app --reload --log-level debug --env-file .env
```

Access at: **[http://localhost:8000](http://localhost:8000)**

**Health Check Endpoint:**

```
GET /health
→ { "status": "ok" }
```

---

## 🧩 Dependencies


```
fastapi

uvicorn[standard]
pydantic-settings

sqlalchemy
alembic
psycopg2-binary
python-dotenv
pytest
black
ruff
```

---


## ✅ Acceptance Criteria

* FastAPI app runs successfully
* `/health` endpoint returns `{ "status": "ok" }`

* Environment variables load correctly from `.env`
* Project structure matches Clean Architecture
* Pre-commit hooks pass (`black`, `ruff`)
* README accurately reflects setup instructions


---

## 🧱 Docstring Style


We follow **reStructuredText (reST)** for Python docstrings, as recommended by PEP 287.

Example:

```python

def add_numbers(a, b):
    """
    Adds two numbers together.

    :param a: First number
    :type a: int or float
    :param b: Second number
    :type b: int or float
    :return: Sum of a and b
    :rtype: int or float
    """
    return a + b
```

---

## 🧼 Code Formatting

**Pre-commit** ensures consistent formatting and linting.


### Install pre-commit


```bash
pip install pre-commit
```

### Run manually

```bash
pre-commit run --all-files
```

---

## 📚 References


* [FastAPI Documentation](https://fastapi.tiangolo.com/)
* [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
* [reStructuredText Docstring Format](http://daouzli.com/blog/docstring.html#restructuredtext)
* [SPARCS Events API Reference](https://github.com/DurianPy-Davao-Python-User-Group/TechTix)

