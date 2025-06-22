from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# Database initialization
def init_db():
    """Initialize the SQLite database with the todos table."""
    conn = sqlite3.connect('todo.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE
        )
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    """Get a database connection with row factory for dict-like access."""
    conn = sqlite3.connect('todo.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    """Serve the main HTML page."""
    return render_template('index.html')

@app.route('/api/todos', methods=['GET'])
def get_todos():
    """Get all todos from the database."""
    conn = get_db_connection()
    todos = conn.execute('SELECT * FROM todos ORDER BY id DESC').fetchall()
    conn.close()
    
    # Convert rows to dictionaries
    todos_list = []
    for todo in todos:
        todos_list.append({
            'id': todo['id'],
            'text': todo['text'],
            'completed': bool(todo['completed'])
        })
    
    return jsonify(todos_list)

@app.route('/api/todos', methods=['POST'])
def create_todo():
    """Create a new todo item."""
    data = request.get_json()
    
    if not data or 'text' not in data or not data['text'].strip():
        return jsonify({'error': 'Todo text is required'}), 400
    
    text = data['text'].strip()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO todos (text, completed) VALUES (?, ?)', (text, False))
    todo_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    new_todo = {
        'id': todo_id,
        'text': text,
        'completed': False
    }
    
    return jsonify(new_todo), 201

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def toggle_todo(todo_id):
    """Toggle the completed status of a todo item."""
    conn = get_db_connection()
    
    # First, get the current todo
    todo = conn.execute('SELECT * FROM todos WHERE id = ?', (todo_id,)).fetchone()
    
    if not todo:
        conn.close()
        return jsonify({'error': 'Todo not found'}), 404
    
    # Toggle the completed status
    new_completed = not bool(todo['completed'])
    conn.execute('UPDATE todos SET completed = ? WHERE id = ?', (new_completed, todo_id))
    conn.commit()
    
    # Get the updated todo
    updated_todo = conn.execute('SELECT * FROM todos WHERE id = ?', (todo_id,)).fetchone()
    conn.close()
    
    return jsonify({
        'id': updated_todo['id'],
        'text': updated_todo['text'],
        'completed': bool(updated_todo['completed'])
    })

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """Delete a todo item."""
    conn = get_db_connection()
    
    # Check if todo exists
    todo = conn.execute('SELECT * FROM todos WHERE id = ?', (todo_id,)).fetchone()
    
    if not todo:
        conn.close()
        return jsonify({'error': 'Todo not found'}), 404
    
    # Delete the todo
    conn.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Todo deleted successfully'})

if __name__ == '__main__':
    # Initialize database on startup
    init_db()
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000)
