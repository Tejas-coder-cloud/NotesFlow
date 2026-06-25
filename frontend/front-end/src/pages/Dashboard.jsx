import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import axios from "axios";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const [loadingSummary, setLoadingSummary] = useState({});
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [summaries, setSummaries] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [summaryUsage, setSummaryUsage] = useState({
    used: 0,
    remaining: 20
  });
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
    fetchUsage();
  }, []);
  const generateSummary = async (content) => {
    try {
      setLoadingSummary((prev) => ({
        ...prev,
        [content]: true
      }));
      const token =
        localStorage.getItem("token");
      const response =
        await axios.post(
          "https://notesflow-backend-frui.onrender.com/api/ai/summary",
          {
            content
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );
      setSummaries((prev) => ({
        ...prev,
        [content]:
          response.data.summary
      }));
      fetchUsage();
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
    } finally {
      setLoadingSummary((prev) => ({
        ...prev,
        [content]: false
      }));
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
  const fetchUsage = async () => {
    try {
      const token =
        localStorage.getItem("token");
      const response =
        await axios.get(
          "https://notesflow-backend-frui.onrender.com/api/ai/usage",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );
      setSummaryUsage({
        used: response.data.used,
        remaining:
          response.data.remaining
      });
    } catch (error) {
      console.log(error);
    }
  };
  const filteredNotes = notes.filter(
    (note) =>
      note.title
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||
      note.content
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
  );
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("NotesFlow Notes", 20, 20);

    let y = 35;

    filteredNotes.forEach((note, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(15);
      doc.text(`${index + 1}. ${note.title}`, 20, y);

      y += 8;

      doc.setFontSize(11);

      const lines = doc.splitTextToSize(
        note.content,
        170
      );

      doc.text(lines, 20, y);

      y += lines.length * 6 + 10;
    });

    doc.save("NotesFlow_Notes.pdf");
  };
  return (
    <div
      className={
        darkMode
          ? "dashboard-page dark"
          : "dashboard-page light"
      }
    >
      <div className="dashboard">

        <div className="dashboard-header">

          <h1 className="dashboard-title">
            NotesFlow Dashboard
          </h1>

          <div className="header-actions">

            <div className="usage-card">
              <span>
                AI Usage: {summaryUsage.used}/20
              </span>

              <span>
                Remaining: {summaryUsage.remaining}
              </span>
            </div>

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
              className="export-btn"
              onClick={exportPDF}
            >
              📄 Export Notes as pdf 
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
        </div>

        <div className="note-form">

          <h2>
            {
              editId
                ? "Update Note"
                : "Create Note"
            }
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

          <div className="notes-header">

            <h2>Your Notes</h2>

            <input
              className="search-input"
              type="text"
              placeholder="🔍 Search notes..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

          {filteredNotes.map((note) => (
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
                disabled={
                  loadingSummary[note.content]
                }
                onClick={() =>
                  generateSummary(
                    note.content
                  )
                }
              >
                {
                  loadingSummary[note.content]
                    ? (
                      <>
                        <span className="spinner"></span>
                        Generating...
                      </>
                    )
                    : (
                      "Generate Summary"
                    )
                }
              </button>

              {
                summaries[note.content] && (
                  <div className="summary-box">

                    <h4>
                      🤖 AI Summary
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
          ))}

        </div>

      </div>
    </div>
  );
}
export default Dashboard;