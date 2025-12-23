import pandas as pd
import os
import json
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- THIS FUNCTION WAS MISSING ---
def save_file(file_content, filename):
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(file_content)
    return file_path
# ---------------------------------

def load_data(filename):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if filename.endswith('.csv'):
        return pd.read_csv(file_path)
    elif filename.endswith(('.xls', '.xlsx')):
        return pd.read_excel(file_path)
    raise ValueError("Unsupported format")

def get_eda_stats(filename, target_col):
    df = load_data(filename)
    if target_col not in df.columns:
        return {}
    
    # 1. Target Distribution (for Bar Chart)
    # Limit to top 10 classes to avoid clutter
    counts = df[target_col].value_counts().head(10)
    distribution = [{"name": str(k), "value": int(v)} for k, v in counts.items()]
    
    return {
        "distribution": distribution,
        "missing_values": df.isnull().sum().to_dict()
    }

def run_pipeline(config):
    df = load_data(config['filename'])
    
    # 1. Handle Target
    target_col = config['target_column']
    df = df.dropna() # Simple cleaning
    
    X = df.drop(columns=[target_col])
    y = df[target_col]

    # Encode Target if it's categorical
    le = LabelEncoder()
    y = le.fit_transform(y)
    class_names = [str(c) for c in le.classes_]

    # Handle Categorical Features in X
    for col in X.select_dtypes(include=['object']).columns:
        X[col] = LabelEncoder().fit_transform(X[col])

    # 2. Preprocessing
    if config['preprocessing'] == 'StandardScaler':
        X = StandardScaler().fit_transform(X)
    elif config['preprocessing'] == 'MinMaxScaler':
        X = MinMaxScaler().fit_transform(X)

    # 3. Split
    test_size = float(config['test_size']) / 100
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)

    # 4. Train
    model = LogisticRegression(max_iter=1000) if config['model'] == 'Logistic Regression' else DecisionTreeClassifier()
    model.fit(X_train, y_train)
    
    # 5. Evaluate
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    cm = confusion_matrix(y_test, preds).tolist()

    return {
        "status": "Success",
        "accuracy": round(acc * 100, 2),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "confusion_matrix": cm,
        "classes": class_names
    }