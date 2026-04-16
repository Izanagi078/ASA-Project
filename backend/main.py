import pandas as pd
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from engine.models import NodeData, MemberData
from engine.solver import solve_frame
import io

app = FastAPI(title="Structural Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_and_solve(nodes_df, members_df):
    def get_id(row):
        for key in row.keys():
            k = str(key).lower().replace(' ', '').replace('_', '').replace('.', '')
            if k in ['slno', 'srno', 'id', 'no']:
                return int(row[key])
        return int(row.iloc[0])

    nodes_df = nodes_df.fillna(0)
    members_df = members_df.fillna(0)
    
    nodes_list = []
    for _, row in nodes_df.iterrows():
        n = NodeData(
            id=get_id(row), x=float(row.get('x', 0)), y=float(row.get('y', 0)),
            u=int(row['u']), v=int(row['v']), theta=int(row['theta']),
            H=float(row.get('H', 0.0)), V=float(row.get('V', 0.0)), M=float(row.get('M', 0.0)),
            settle_u=float(row.get('settle_u', 0.0)),
            settle_v=float(row.get('settle_v', 0.0)),
            settle_theta=float(row.get('settle_theta', 0.0))
        )
        nodes_list.append(n)

    members_list = []
    for _, row in members_df.iterrows():
        # Fallback names based on previous logic and typical CSVs
        w1_val = float(row.get('Triangular_load', 0.0))
        w2_val = float(row.get('Unnamed: 9', 0.0))
        
        m = MemberData(
            id=get_id(row),
            node_i=int(row.get('Node_1', 0)), node_j=int(row.get('Node_2', 0)),
            area=float(row['Area']), moi=float(row['MoI']), e=float(row['E']),
            udl=float(row.get('UDL', 0.0)),
            point_load=float(row.get('Point_load', 0.0)),
            point_load_a=float(row.get('point_load_a', 0.0)),
            w1=w1_val,
            w2=w2_val
        )
        members_list.append(m)

    results = solve_frame(nodes_list, members_list)
    results['nodes'] = [{"id": n.id, "x": n.x, "y": n.y, "u": n.u, "v": n.v, "theta": n.theta, "H": n.H, "V": n.V, "M": n.M} for n in nodes_list]
    results['members'] = [{"id": m.id, "node_i": m.node_i, "node_j": m.node_j, "udl": m.udl, "point_load": m.point_load, "w1": m.w1, "w2": m.w2} for m in members_list]
    
    return results

@app.post("/api/analyze/upload")
async def analyze_upload(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        if file.filename.endswith('.xlsx'):
            xl = pd.ExcelFile(io.BytesIO(content))
            sheet_names = xl.sheet_names
            
            node_sheet = next((s for s in sheet_names if 'node' in s.lower()), sheet_names[0])
            member_sheet = next((s for s in sheet_names if 'member' in s.lower()), sheet_names[1])
            
            nodes_df = pd.read_excel(xl, sheet_name=node_sheet)
            members_df = pd.read_excel(xl, sheet_name=member_sheet)
        else:
            raise HTTPException(status_code=400, detail="Currently, only .xlsx uploads are fully supported through this endpoint.")

        results = parse_and_solve(nodes_df, members_df)
        return {"status": "success", "results": results}

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"status": "error", "error": str(e)}

def test_local_script():
    # Retained the old script logic for your local testing purposes
    node_file = "Sample_Input sheet.xlsx - Node.csv"
    member_file = "Sample_Input sheet.xlsx - Member.csv"
    print("Running local fallback test on CSV files...")
    
    nodes_df = pd.read_csv(node_file)
    members_df = pd.read_csv(member_file)
    results = parse_and_solve(nodes_df, members_df)
    
    # 3. Print the Output
    print("="*50)
    print("1. DISPLACEMENTS AT NODES")
    print("="*50)
    for node_id, disps in results['displacements'].items():
        print(f"Node {node_id}: dx = {disps['dx']:.6e} m, dy = {disps['dy']:.6e} m, theta = {disps['theta']:.6e} rad")
    
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        test_local_script()
    else:
        import uvicorn
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)