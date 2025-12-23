# No-Code ML Pipeline Builder 🚀

A full-stack, no-code web application that empowers users to build, visualize, and execute Machine Learning pipelines without writing a single line of code. Designed with a focus on intuitive UX, visual flow, and simplicity.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-React_FastAPI-blue)

---

## 🎯 Objective
[cite_start]To evaluate the ability to design functionality, build clean UIs, and simplify complex ML workflows into an intuitive experience[cite: 4]. [cite_start]The platform mimics a drag-and-drop or step-based ML pipeline builder[cite: 31].

## ✨ Key Features

### 1. 📂 Dataset Upload
- [cite_start]Supports **CSV** and **Excel (.xlsx)** file formats[cite: 7].
- [cite_start]Automatically detects and displays row counts, column counts, and column names[cite: 8].
- [cite_start]Includes error handling for unsupported formats[cite: 9].

### 2. ⚙️ Preprocessing & EDA
- [cite_start]**Exploratory Data Analysis (EDA):** Automatically generates a bar chart showing the target class distribution to check for dataset balance[cite: 29].
- [cite_start]**Preprocessing Options:** Users can select scaling strategies via a dropdown[cite: 14]:
  - [cite_start]**StandardScaler** (Z-Score normalization)[cite: 12].
  - [cite_start]**MinMaxScaler** (0-1 normalization)[cite: 13].

### 3. ✂️ Train-Test Split
- [cite_start]Interactive slider to define the training and testing split ratio (e.g., 80-20, 70-30)[cite: 17].
- [cite_start]Visual confirmation of the split percentages[cite: 18].

### 4. 🧠 Model Selection & Training
- [cite_start]Users can choose between **Logistic Regression** and **Decision Tree Classifier**[cite: 21, 22].
- [cite_start]The selected model is trained instantly on the processed data[cite: 24].

### 5. 📊 Visual Results Dashboard
- [cite_start]Displays the **Model Accuracy** score clearly[cite: 28].
- [cite_start]Renders a **Confusion Matrix** grid to visualize correct vs. misclassified predictions[cite: 29].
- [cite_start]Shows sample counts for training and testing sets[cite: 27].

---

## 🛠️ Tech Stack

### Frontend (Client-Side)
- **React.js (Vite):** Fast, modern frontend framework.
- **Tailwind CSS:** For a clean, responsive, and professional UI.
- **Recharts:** For rendering the EDA and Result visualizations.
- **Lucide React:** For consistent and intuitive iconography.

### Backend (Server-Side)
- **FastAPI (Python):** High-performance API for handling ML logic.
- **Pandas:** For efficient data manipulation and loading.
- **Scikit-Learn:** For preprocessing (StandardScaler, MinMaxScaler) and Model Training.

---

## 🚀 How to Run the Project

### Prerequisites
- **Node.js** (v14+)
- **Python** (v3.8+)

### Step 1: Start the Backend
The backend handles file uploads and ML processing.
```bash
cd backend
# Create virtual environment (Optional but recommended)
python -m venv venv
# Activate venv:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
Server will start at: http://localhost:8000

Step 2: Start the Frontend
The frontend provides the user interface.

Bash

cd frontend
# Install dependencies
npm install

# Run the development server
npm run dev
UI will start at: http://localhost:5173 (or similar)

🧪 Testing the Pipeline
To get the best results (100% Accuracy), use a classification dataset.

Download Dataset: Iris.csv (Standard Classification Dataset)

Upload: Drag & Drop iris.csv into the app.

Preprocessing: Select Target Column = species.

EDA: Observe the balanced bar chart.

Model: Choose Decision Tree.

Run: Click "Build & Run Pipeline" to see the dashboard.

📂 Project Structure
Plaintext

/root
  ├── /backend
  │     ├── main.py          # API Endpoints
  │     ├── ml_service.py    # Core ML Logic (Pandas/Sklearn)
  │     └── uploads/         # Temp storage for datasets
  │
  ├── /frontend
  │     ├── src/
  │     │    ├── components/ # Reusable UI components (PipelineStep)
  │     │    ├── api.js      # Axios API calls
  │     │    └── App.jsx     # Main Application Logic
  │     └── package.json
  │
  └── README.md