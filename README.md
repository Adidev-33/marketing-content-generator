# Marketing Content Generator 🚀

This is a full-stack web application that uses AI to generate high-quality marketing copy. It features a modern, interactive frontend built with React and a robust backend API built with Python and FastAPI, including a persistent history of all generated content.



---
## ## Features

* **AI-Powered Content Creation**: Generates detailed marketing copy including a headline, description, key features, and a call-to-action.
* **Persistent History**: Automatically saves every generated piece of content to a local SQLite database.
* **Interactive History Accordion**: View past generations in a clean, collapsible UI that expands on click.
* **Delete Functionality**: Remove individual history items or clear the entire generation history with a single click.
* **Modern UI**: A colorful and responsive user interface with loading states and smooth animations built with React.

---
## ## Tech Stack

| Category      | Technology                                    |
| :------------ | :-------------------------------------------- |
| **Frontend** | React, Axios, React Hooks                     |
| **Backend** | Python, FastAPI                               |
| **Database** | SQLite                                        |
| **AI API** | Groq                                          |
| **AI Model** | Llama 3.3 70B Versatile                       |

---
## ## Getting Started: Setup and Installation

Follow these steps to get the entire application running on your local machine.

### ### Prerequisites

* **Python 3.8+** and pip
* **Node.js** and npm

### ### Step 1: Clone the Repository

Clone this project to your local machine.
```bash
git clone <your-repo-link>
cd marketing-content-generator
```

### ### Step 2: Set Up the Backend

1.  **Navigate to the backend directory.**
    ```bash
    cd backend
    ```

2.  **Create and activate a Python virtual environment.**
    ```bash
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```

3.  **Install the required Python packages.**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Create your environment file.**
    Create a file named `.env` in the `/backend` directory and add your Groq API key.
    ```
    GROQ_API_KEY="your_groq_api_key_here"
    ```

### ### Step 3: Set Up the Frontend

1.  **Navigate to the frontend directory** from the project's root folder.
    ```bash
    cd frontend
    ```

2.  **Install the required npm packages.**
    ```bash
    npm install
    ```

### ### Step 4: Run the Application

You will need **two separate terminals** open to run both the backend and frontend servers simultaneously.

**In your first terminal (for the Backend):**
```bash
# Navigate to the backend folder
cd backend

# Activate the virtual environment (if not already active)
source venv/bin/activate

# Start the FastAPI server
uvicorn main:app --reload
```
Your backend API will now be running at `http://localhost:8000`.

**In your second terminal (for the Frontend):**
```bash
# Navigate to the frontend folder
cd frontend

# Start the React development server
npm start
```
Your frontend application will open in your browser at `http://localhost:3000`.

---
## ## AI Integration & Prompting

### ### AI API Used: Groq

This project uses the **Groq API** to power its content generation.

* **Why Groq?** The primary reason for choosing Groq is its **incredible speed**. Groq runs models on its custom LPU (Language Processing Unit) hardware, delivering responses at an exceptionally high rate, which creates a much better user experience. It also provides free access to powerful open-source models.

### ### Prompt Used for the AI Model

To ensure consistent and high-quality output, a detailed system prompt is sent to the AI with every request. This instructs the model on its role, the desired format, and the structure of the content.

> You are an expert marketing copywriter. Your task is to generate compelling marketing text for a product.
> The output should be a single block of text, structured as follows:
> 1. A catchy and attractive headline.
> 2. A short, engaging paragraph (2-3 sentences) describing the product's main benefit.
> 3. A bulleted list of 3 key features, starting each with a relevant emoji.
> 4. A strong call-to-action at the end.
> Do not use JSON or markdown formatting. Just provide the raw text.

---
## ## Challenges Faced & Solutions

During development, several challenges were encountered and resolved:

* **Challenge: CORS Errors**
    * **Problem**: The browser blocked the frontend (on `localhost:3000`) from making requests to the backend (on `localhost:8000`) due to Cross-Origin Resource Sharing (CORS) policy.
    * **Solution**: Implemented FastAPI's `CORSMiddleware` on the backend to explicitly allow requests from the frontend's origin.

* **Challenge: Decommissioned AI Models**
    * **Problem**: The Groq API frequently updated its available models, causing previously used models like `llama3-8b-8192` to be decommissioned, resulting in API errors.
    * **Solution**: The code was updated to use a more stable and powerful model (`mixtral-8x7b-32768`), highlighting the need to be adaptable when working with rapidly evolving third-party APIs.

* **Challenge: API Key Security**
    * **Problem**: Hardcoding the `GROQ_API_KEY` directly into the Python script would be a major security risk, especially in a public repository.
    * **Solution**: The `python-dotenv` library was used to load the API key from a `.env` file, which is included in `.gitignore` to prevent it from ever being committed.

---
## ## API Endpoints

The backend provides the following REST API endpoints:

| Method   | Endpoint                  | Description                                            |
| :------- | :------------------------ | :----------------------------------------------------- |
| `POST`   | `/generate-content`       | Generates marketing content and saves it to history.   |
| `GET`    | `/history`                | Fetches all saved history items.                       |
| `DELETE` | `/history/{item_id}`      | Deletes a specific history item by its ID.             |
| `DELETE` | `/history`                | Deletes all history items.                             |