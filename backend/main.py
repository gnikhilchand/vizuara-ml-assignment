from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import ml_service

app = FastAPI()

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineConfig(BaseModel):
    filename: str
    target_column: str
    preprocessing: str
    test_size: int
    model: str

class EDAConfig(BaseModel):
    filename: str
    target_column: str

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Save file temporarily
        file_path = ml_service.save_file(await file.read(), file.filename)
        
        # Read columns for the frontend dropdown [cite: 8]
        df = ml_service.load_data(file.filename)
        columns = list(df.columns)
        
        return {
            "filename": file.filename,
            "columns": columns,
            "rows": df.shape[0],
            "cols": df.shape[1]
        }
    except Exception as e:
        print(f"UPLOAD ERROR: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/eda")
def get_eda(config: EDAConfig):
    try:
        return ml_service.get_eda_stats(config.filename, config.target_column)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run_pipeline")
def run_pipeline(config: PipelineConfig):
    try:
        results = ml_service.run_pipeline(config.dict())
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)