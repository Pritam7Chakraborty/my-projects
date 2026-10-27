from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, SQLModel, Session, create_engine, select

# -------------------------------------------------------------------
# 1. DATABASE SETUP
# -------------------------------------------------------------------

sqlite_file_name = "gradebook.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

# -------------------------------------------------------------------
# 2. MODELS & SCHEMAS
# -------------------------------------------------------------------
# Database Model

class GradeRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_name: str
    course_name: str
    assignment_score: float
    midterm_score: float
    final_score: float
    letter_grade: str
    final_percentage: float

# Input Request schema
# NOTE: field name is "assignment_score" (singular) - this MUST match
# whatever key the frontend sends in its JSON body, or FastAPI will
# reject the request with a 422 because a required field is "missing".

class GradeCreate(SQLModel):
    student_name: str
    course_name: str
    assignment_score: float
    midterm_score: float
    final_score: float

class GradeUpdate(SQLModel):
    student_name: Optional[str] = None
    course_name: Optional[str] = None
    assignment_score: Optional[float] = None
    midterm_score: Optional[float] = None
    final_score: Optional[float] = None

# -------------------------------------------------------------------
# 3. BUSINESS LOGIC
# -------------------------------------------------------------------

def calculate_weighted_grade(assignments: float, midterm: float, final: float):
    total_percentage = (assignments * 0.40) + (midterm * 0.30) + (final * 0.30)

    if total_percentage >= 90:
        letter = "A"
    elif total_percentage >= 80:
        letter = "B"
    elif total_percentage >= 70:
        letter = "C"
    elif total_percentage >= 60:
        letter = "D"
    else:
        letter = "F"

    return round(total_percentage, 2), letter

# -------------------------------------------------------------------
# 4. FASTAPI APP & ROUTES
# -------------------------------------------------------------------

app = FastAPI(lifespan=lifespan)

# allow_credentials=True + allow_origins=["*"] is an invalid combination
# per the CORS spec - browsers will silently refuse to honor the
# wildcard when credentials are involved. This app never sends cookies
# or auth headers, so credentials aren't needed; turning it off makes
# the wildcard origin actually work.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/grade", response_model=GradeRecord)
def create_grade(data: GradeCreate, session: Session = Depends(get_session)):
    final_percentage, letter_grade = calculate_weighted_grade(
        data.assignment_score,
        data.midterm_score,
        data.final_score
    )

    db_record = GradeRecord(
        student_name=data.student_name,
        course_name=data.course_name,
        assignment_score=data.assignment_score,
        midterm_score=data.midterm_score,
        final_score=data.final_score,
        letter_grade=letter_grade,
        final_percentage=final_percentage
    )

    session.add(db_record)
    session.commit()
    session.refresh(db_record)
    return db_record

@app.get("/api/grades", response_model=List[GradeRecord])
def get_grades(session: Session = Depends(get_session)):
    grades = session.exec(select(GradeRecord)).all()
    return grades

@app.put("/api/grades/{grade_id}", response_model=GradeRecord)
def update_grade(grade_id: int, data: GradeUpdate, session: Session = Depends(get_session)):
    db_record = session.get(GradeRecord, grade_id)
    if not db_record:
        raise HTTPException(status_code=404, detail="Grade record not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_record, key, value)

    final_percentage, letter = calculate_weighted_grade(
        db_record.assignment_score,
        db_record.midterm_score,
        db_record.final_score
    )

    db_record.final_percentage = final_percentage
    db_record.letter_grade = letter

    session.add(db_record)
    session.commit()
    session.refresh(db_record)
    return db_record

@app.delete("/api/grades/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(grade_id: int, session: Session = Depends(get_session)):
    db_record = session.get(GradeRecord, grade_id)
    if not db_record:
        raise HTTPException(status_code=404, detail="Grade record not found")

    session.delete(db_record)
    session.commit()
    return None