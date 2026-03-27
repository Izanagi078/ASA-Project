from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import io

from engine.solver import solve_frame
from engine.models import Node, Member, NodeData, MemberData

app = FastAPI(title="Structural Analysis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    nodes: List[NodeData]
    members: List[MemberData]

@app.get("/api/status")
def status():
    return {"status": "Analysis Engine Online"}

@app.post("/api/analyze/manual")
def analyze_manual(payload: AnalysisRequest):
    return process_analysis(payload.nodes, payload.members)

@app.post("/api/analyze/upload")
async def analyze_upload(file: UploadFile = File(...)):
    content = await file.read()
    
    if file.filename.endswith('.xlsx'):
        df_nodes = pd.read_excel(io.BytesIO(content), sheet_name='Node')
        df_members = pd.read_excel(io.BytesIO(content), sheet_name='Member')
        
        nodes, members = parse_dataframes(df_nodes, df_members)
        return process_analysis(nodes, members)
    
    return {"error": "Unsupported file format. Please upload .xlsx"}

def parse_dataframes(df_nodes, df_members) -> tuple[List[NodeData], List[MemberData]]:
    nodes = []
    # Using iterrows ensures every single row of the Excel is parsed
    for _, row in df_nodes.iterrows():
        nodes.append(NodeData(
            id=int(row['Sr_No.']),
            x=float(row['x']),
            y=float(row['y']),
            u=int(row['u']),
            v=int(row['v']),
            theta=int(row['theta']),
            H=float(row['H']) if pd.notna(row['H']) else 0.0,
            V=float(row['V']) if pd.notna(row['V']) else 0.0,
            M=float(row['M']) if pd.notna(row['M']) else 0.0
        ))
        
    members = []
    for _, row in df_members.iterrows():
        members.append(MemberData(
            id=int(row['Sr_No.']),
            node_i=int(row['Node_1']),
            node_j=int(row['Node_2']),
            area=float(row['Area']),
            moi=float(row['MoI']),
            e=float(row['E']),
            udl=float(row['UDL']) if pd.notna(row['UDL']) else 0.0,
            point_load=float(row['Point_load']) if pd.notna(row['Point_load']) else 0.0
        ))
        
    return nodes, members

def process_analysis(nodes: List[NodeData], members: List[MemberData]):
    # directly call the solver applying user logic
    results = solve_frame(nodes, members)
    return {"status": "success", "results": results}
