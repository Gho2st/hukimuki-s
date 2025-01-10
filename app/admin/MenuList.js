import { useEffect, useState } from "react";
import Which2 from "./Which2"; // Importujemy komponent Which2
import classes from "./MenuList.module.css";

const MenuList = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolder, setNewFolder] = useState(""); // Nowy folder do dodania
  const [loading, setLoading] = useState(false); // Śledzenie stanu ładowania
  const [error, setError] = useState(null); // Śledzenie błędów

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/menu/get_all_menu");
        if (!res.ok) throw new Error("Błąd podczas pobierania danych.");
        const data = await res.json();
        setFolders(data); // Przypisanie nazw folderów
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  const handleDeleteFolder = async (folderName) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/menu/delete_folder?which=${folderName}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Błąd podczas usuwania folderu.");
      const data = await res.json();
      if (data.success) {
        setFolders(folders.filter((folder) => folder !== folderName));
        setSelectedFolder(null);
      } else {
        throw new Error(data.error || "Nieznany błąd.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFolder = async () => {
    if (!newFolder.trim()) {
      setError("Nazwa folderu nie może być pusta.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("which", newFolder);

      const res = await fetch("/api/menu/add_folder", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Błąd podczas dodawania folderu.");
      }

      const data = await res.json();
      if (data.success) {
        setFolders([...folders, newFolder]);
        setNewFolder("");
      } else {
        throw new Error(data.error || "Nieznany błąd.");
      }
    } catch (error) {
      console.error("Błąd podczas dodawania folderu:", error.message);
      setError(error.message || "Nieoczekiwany błąd.");
    } finally {
      setLoading(false);
    }
  };

  const moveFolder = (index, direction) => {
    const updatedFolders = [...folders];
    const [removedFolder] = updatedFolders.splice(index, 1);
    const newIndex = direction === "up" ? index - 1 : index + 1;
    updatedFolders.splice(newIndex, 0, removedFolder);
    setFolders(updatedFolders);
    updateOrderJson(updatedFolders);
  };

  const updateOrderJson = async (updatedFolders) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/menu/update_folder_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFolders),
      });
      if (!res.ok)
        throw new Error("Błąd podczas aktualizacji kolejności folderów.");
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Nieznany błąd.");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={classes.container}>
        <h3>Zarządzaj menu</h3>
        <div className={classes.errorInfo}>
          {loading && <p>Trwa ładowanie...</p>}
          {error && <p className={classes.error}>{error}</p>}
        </div>
        <div className={classes.inputContainer}>
          <p>Dodaj nową sekcję menu</p>
          <input
            type="text"
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            placeholder="Nazwa nowej sekcji"
          />
          <button onClick={handleAddFolder} disabled={loading}>
            Dodaj
          </button>
        </div>

        <ul className={classes.buttonsList}>
          {folders.map((folder, index) => (
            <li key={folder} className={classes.itemContainer}>
              <button
                className={classes.mainButton}
                onClick={() => handleFolderClick(folder)}
              >
                {folder.replace("menu/", "").replace("/", "")}
              </button>
              <div className={classes.functionalButtons}>
                <button
                  onClick={() => handleDeleteFolder(folder)}
                  disabled={loading}
                >
                  Usuń
                </button>
                <button
                  onClick={() => moveFolder(index, "up")}
                  disabled={loading || index === 0}
                >
                  Przenieś w górę
                </button>
                <button
                  onClick={() => moveFolder(index, "down")}
                  disabled={loading || index === folders.length - 1}
                >
                  Przenieś w dół
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedFolder && <Which2 which={selectedFolder} />}
    </>
  );
};

export default MenuList;
