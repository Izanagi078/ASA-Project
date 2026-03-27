import pandas as pd
import json

excel_path = "../asaLAB5.xlsx"
try:
    xl = pd.ExcelFile(excel_path)
    result = {"sheets": xl.sheet_names, "data": {}}
    for sheet in xl.sheet_names:
        df = pd.read_excel(xl, sheet_name=sheet)
        # Replacing .head(3) to read ALL rows, replacing NaNs with 0 for JSON serialization
        result["data"][sheet] = df.fillna(0).to_dict(orient="records")
    
    with open("excel_schema.json", "w") as f:
        json.dump(result, f, indent=2)
    print("Full excel data written to excel_schema.json")
except Exception as e:
    print("Error parsing Excel:", e)
