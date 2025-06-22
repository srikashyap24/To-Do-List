# Modern Todo App

A clean, responsive, and feature-rich todo application built with Flask and vanilla JavaScript.

## Features

- ✨ Modern, responsive design
- 📱 Mobile-friendly interface
- 🎯 RESTful API backend
- 💾 SQLite database persistence
- ⚡ Real-time updates without page reloads
- 🎨 Smooth animations and transitions
- ♿ Accessible design with keyboard shortcuts
- 🔔 Toast notifications for user feedback

## Screenshots

The app features a beautiful, modern interface with:
- Clean input field for adding new tasks
- Checkbox-based task completion
- Delete functionality for each task
- Task statistics (total and completed)
- Empty state when no tasks exist
- Responsive design that works on all devices

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with CSS Grid/Flexbox
- **Icons**: Unicode emojis and custom CSS

## Setup Instructions

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project files**

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv todo-env
   
   # On Windows:
   todo-env\Scripts\activate
   
   # On macOS/Linux:
   source todo-env/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Access the application**:
   Open your web browser and navigate to `http://localhost:5000`

The application will automatically create the SQLite database (`todo.db`) on first run.

## Project Structure

```
todo-app/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .gitignore         # Git ignore rules
├── README.md          # This file
├── templates/
│   └── index.html     # Main HTML template
├── static/
│   ├── style.css      # CSS styling
│   └── script.js      # JavaScript functionality
└── todo.db            # SQLite database (created automatically)
```

## API Endpoints

The application provides a RESTful API:

- `GET /api/todos` - Retrieve all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/<id>` - Toggle todo completion status
- `DELETE /api/todos/<id>` - Delete a todo

## Usage

### Adding Tasks
1. Type your task in the input field
2. Click "Add Task" or press Enter
3. The task appears at the top of the list

### Managing Tasks
- **Complete a task**: Click the checkbox next to the task
- **Delete a task**: Click the "Delete" button
- **View statistics**: See total and completed task counts

### Keyboard Shortcuts
- `/` - Focus the input field
- `Ctrl+C` - Clear all completed tasks (with confirmation)

## Development

### Database Schema

The app uses a simple SQLite table:

```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);
```

### Customization

You can easily customize the app:

- **Colors**: Modify CSS custom properties in `static/style.css`
- **Fonts**: Change the Google Fonts import in `templates/index.html`
- **Features**: Add new API endpoints in `app.py` and corresponding JavaScript in `static/script.js`

## Deployment

### Local Production

For production deployment, consider:

1. Set `debug=False` in `app.py`
2. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

### Cloud Deployment

The app can be deployed to various platforms:

- **Heroku**: Add a `Procfile` with `web: gunicorn app:app`
- **Railway**: Works out of the box with the existing files
- **DigitalOcean App Platform**: Configure with Python buildpack
- **PythonAnywhere**: Upload files and configure WSGI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues:

1. Check that Python 3.7+ is installed
2. Ensure all dependencies are installed via `pip install -r requirements.txt`
3. Verify that port 5000 is not in use by another application
4. Check the console for any error messages

For additional help, please review the code comments or create an issue in the project repository.
