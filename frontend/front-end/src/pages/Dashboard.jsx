import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [summaries, setSummaries] = useState({});
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://notesflow-backend-frui.onrender.com/api/notes",
        {
          headers:
          {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNotes(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const createNote = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://notesflow-backend-frui.onrender.com/api/notes",
        {
          title,
          content
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://notesflow-backend-frui.onrender.com/api/notes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };
  const updateNote = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://notesflow-backend-frui.onrender.com/api/notes/${editId}`,
        {
          title,
          content
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setEditId(null);
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  const generateSummary = async (content) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://notesflow-backend-frui.onrender.com/api/ai/summary",
        {
          content
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSummaries((prev) => ({
        ...prev,
        [content]: response.data.summary
      }));

    } catch (error) {
      console.log(error);
      if (
        error.response?.status === 429
      ) {

        toast.error(
          "Daily summary limit reached"
        );

      } else {

        toast.error(
          "Failed to generate summary"
        );
      }
    }
  };
  const toggleTheme = () => {

    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    );
  };
  return (
    <div className={darkMode ? "dashboard-page dark" : "dashboard-page light"}>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            NotesFlow Dashboard
          </h1>

          <button
            className="theme-btn"
            onClick={toggleTheme}
          >
            {
              darkMode
                ? "☀️ Light"
                : "🌙 Dark"
            }
          </button>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
        <div className="note-form">
          <h2>
            {editId
              ? "Update Note"
              : "Create Note"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
          />
          <button
            className="primary-btn"
            onClick={
              editId
                ? updateNote
                : createNote
            }
          >
            {
              editId
                ? "Update Note"
                : "Create Note"
            }
          </button>
        </div>
        <div className="notes-section">
          <h2>Your Notes</h2>
          {
            notes.map((note) => (
              <div
                key={note._id}
                className="note-card"
              >
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setTitle(note.title);
                    setContent(note.content);
                    setEditId(note._id);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteNote(note._id)
                  }
                >
                  Delete
                </button>
                <button
                  className="primary-btn"
                  onClick={() =>
                    generateSummary(
                      note.content
                    )
                  }
                >
                  Generate Summary
                </button>
                {
                  summaries[note.content] && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "10px",
                        border:
                          "1px solid #ccc",
                        borderRadius: "5px",
                        backgroundColor:
                          "#f8f8f8"
                      }}
                    >
                      <h4>
                        AI Summary
                      </h4>
                      <p>
                        {
                          summaries[
                          note.content
                          ]
                        }
                      </p>
                    </div>
                  )
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
export default Dashboard;