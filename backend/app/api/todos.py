from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..core import auth
from ..models import models
from ..schemas import schemas

router = APIRouter()

@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@router.post("/create_task", response_model=schemas.Todo)
def create_todo(
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_todo = models.Todo(**todo.dict(), owner_id=current_user.id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.get("/get_tasks", response_model=List[schemas.Todo])
def read_todos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    todos = db.query(models.Todo).filter(models.Todo.owner_id == current_user.id).offset(skip).limit(limit).all()
    return todos

@router.get("/tasks/{todo_id}", response_model=schemas.Todo)
def read_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id, models.Todo.owner_id == current_user.id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.put("/tasks/{todo_id}", response_model=schemas.Todo)
def update_todo(
    todo_id: int,
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id, models.Todo.owner_id == current_user.id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    for key, value in todo.dict().items():
        setattr(db_todo, key, value)
    
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.delete("/tasks/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id, models.Todo.owner_id == current_user.id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(todo)
    db.commit()
    return None 