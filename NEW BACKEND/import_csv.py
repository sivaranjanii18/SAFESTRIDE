import pandas as pd
from app.database import SessionLocal, engine
from app.models import CrimeData, Base

# Create all tables first
Base.metadata.create_all(bind=engine)

# Read your CSV file
df = pd.read_csv("data_fixed.csv")

# Open database connection
db = SessionLocal()

# Check if data already exists
existing = db.query(CrimeData).count()
if existing > 0:
    print(f"Data already imported ({existing} rows). Skipping.")
else:
    for _, row in df.iterrows():
        record = CrimeData(
            location=row["Location"],
            latitude=row["Latitude"],
            longitude=row["Longitude"],
            time=row["Time"],
            report_text=row["ReportText"],
            heel_tap=row["HeelTap"],
            risk_label=row["RiskLabel"]
        )
        db.add(record)

    db.commit()
    print(f"Successfully imported {len(df)} rows into the database!")

db.close()