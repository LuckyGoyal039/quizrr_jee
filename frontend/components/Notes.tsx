"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Note {
  id: string;
  topic: string;
  content: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currNote, setCurrNote] = useState<Note | null>(null);
  const [search, setSearch] = useState("");
  const [searchedNotes, setSearchedNotes] = useState<Note[]>([]);

  const getNotes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user/my-notes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/user/my-notes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const createNote = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/my-notes",
        {
          topic: "New Note",
          content: "Start writing your note here...",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotes([...notes, response.data]);
      setCurrNote(response.data);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async () => {
    if (!currNote) return;

    try {
      const response = await axios.patch(
        `http://localhost:3000/user/my-notes/${currNote.id}`,
        {
          topic: currNote.topic,
          content: currNote.content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === currNote.id ? response.data : note))
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    setSearchedNotes(
      notes.filter(
        (note) =>
          note.topic.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, notes]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2">Search Notes</h1>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by topic or content"
        />
      </div>
      <Button onClick={createNote} className="mb-4">Add New Note</Button>
      <div className="grid grid-cols-[1fr_3fr] gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Notebooks</h2>
          <div className="h-96 overflow-y-auto space-y-2">
            {(search === "" ? notes : searchedNotes).map((note) => (
              <div
                key={note.id}
                className="cursor-pointer bg-yellow-100 hover:bg-yellow-300 p-2 rounded"
                onClick={() => setCurrNote(note)}
              >
                <p className="font-medium">{note.topic}</p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  variant="destructive"
                  size="sm"
                  className="mt-1"
                >
                  Delete
                </Button>
              </div>
            ))}
            {(search === "" ? notes : searchedNotes).length === 0 && (
              <p>No notes found</p>
            )}
          </div>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          {currNote ? (
            <div className="flex flex-col h-full">
              <div className="grid grid-rows-[auto_1fr] gap-4 flex-grow">
                <Input
                  value={currNote.topic}
                  onChange={(e) =>
                    setCurrNote({ ...currNote, topic: e.target.value })
                  }
                  className="text-xl font-bold"
                />
                <Textarea
                  value={currNote.content}
                  onChange={(e) =>
                    setCurrNote({ ...currNote, content: e.target.value })
                  }
                  className="flex-grow"
                />
              </div>
              <Button onClick={updateNote} className="mt-4">Update Note</Button>
            </div>
          ) : (
            <p className="text-center text-gray-500">Select a note to edit</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;