
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date, datetime
import models, schemas, database, auth

app = FastAPI(title="HabitQuest Pro API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = auth.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return auth.create_user(db=db, user=user)

@app.post("/habits", response_model=schemas.Habit)
def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return models.Habit.create(db, habit, user_id=current_user.id)

@app.get("/habits")
def get_habits(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Habit).filter(models.Habit.user_id == current_user.id).all()

@app.post("/habits/{habit_id}/complete")
def mark_complete(habit_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    today = date.today()
    existing = db.query(models.Completion).filter(
        models.Completion.habit_id == habit_id,
        models.Completion.date == today
    ).first()
    
    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "unmarked"}
    
    new_comp = models.Completion(habit_id=habit_id, date=today, timestamp=datetime.now())
    db.add(new_comp)
    db.commit()
    # Trigger real-time calculation logic here
    return {"status": "completed"}

@app.get("/stats/streaks")
def get_streaks(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Complex logic for streak calculation based on history
    habits = db.query(models.Habit).filter(models.Habit.user_id == current_user.id).all()
    results = []
    for habit in habits:
        streak = auth.calculate_streak(db, habit.id)
        results.append({"habit_id": habit.id, "streak": streak})
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
