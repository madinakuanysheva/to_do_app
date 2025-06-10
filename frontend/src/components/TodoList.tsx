import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdTodo = await createTodo(newTodo.title, newTodo.description);
      setTodos([...todos, createdTodo]);
      setNewTodo({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleUpdateTodo = async (id: number, title: string, description: string) => {
    try {
      const updatedTodo = await updateTodo(id, title, description);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username}!
        </Typography>

        <Paper sx={{ p: 2, mb: 4 }}>
          <form onSubmit={handleCreateTodo}>
            <TextField
              fullWidth
              label="Title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Add Todo
            </Button>
          </form>
        </Paper>

        <List>
          {todos.map((todo) => (
            <Paper key={todo.id} sx={{ mb: 2 }}>
              <ListItem>
                {editingTodo?.id === todo.id ? (
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={editingTodo.title}
                      onChange={(e) =>
                        setEditingTodo({ ...editingTodo, title: e.target.value })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      value={editingTodo.description}
                      onChange={(e) =>
                        setEditingTodo({ ...editingTodo, description: e.target.value })
                      }
                      margin="normal"
                      multiline
                      rows={2}
                    />
                    <Button
                      onClick={() =>
                        handleUpdateTodo(
                          todo.id,
                          editingTodo.title,
                          editingTodo.description
                        )
                      }
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingTodo(null)}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <>
                    <ListItemText
                      primary={todo.title}
                      secondary={todo.description}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => setEditingTodo(todo)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            </Paper>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default TodoList; 