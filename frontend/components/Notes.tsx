"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Textarea } from "./ui/textarea";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Note {
  id?: string;
  topic?: string;
  content?: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currNote, setCurrNote] = useState<{
    id?: string;
    topic?: string;
    content?: string;
  }>();
  const [search, setSearch] = useState("");
  const [searchedNotes, setSearchedNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const getNotes = async () => {
    try {
      const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
      const response = await axios.get(`${SERVER_BASE_URL}/user/my-notes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotes(response.data);
      console.log("get", response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const deleteNote = async (id?: string) => {
    try {
      const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
      await axios.delete(`${SERVER_BASE_URL}/user/my-notes/${currNote?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("del", id, currNote);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      getNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setEditOpen(false);
    }
  };

  const createNote = async ({ topic, content }: { topic?: string; content?: string }) => {
    try {
      const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
      const response = await axios.post(
        `${SERVER_BASE_URL}/user/my-notes`,
        {
          topic,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotes([...(notes ?? []), response.data]);
      console.log('first', notes)
      await getNotes();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async () => {
    if (!currNote) return;

    try {
      if (currNote?.topic?.trim() === "") {
        return;
      }
      const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
      const response = await axios.patch(
        `${SERVER_BASE_URL}/user/my-notes/${currNote.id}`,
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
        prevNotes.map((note) =>
          note.id === currNote.id ? response.data : note
        )
      );
      getNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setEditOpen(false);
    }
  };

  const handleCreate = async () => {
    try {
      if (!currNote) return
      if (currNote?.topic?.trim() === "") {
        return;
      }
      await createNote({
        topic: currNote?.topic?.trim(),
        content: currNote?.content?.trim(),
      });
    } catch (error) {
      console.log(error)
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    setSearchedNotes(
      notes?.filter(
        (note) =>
          note?.topic?.toLowerCase()?.includes(search.toLowerCase()) ||
          note?.content?.toLowerCase()?.includes(search.toLowerCase())
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
      <div className="">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setCurrNote({ topic: "", content: "" })}
              className="mb-4"
            >
              Add New Note
            </Button>
          </DialogTrigger>
          {currNote && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Note</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="name" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="name"
                    value={currNote.topic}
                    onChange={(e) =>
                      setCurrNote({ ...currNote!, topic: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="username" className="text-right">
                    Content
                  </Label>
                  <Textarea
                    id="username"
                    value={currNote.content}
                    onChange={(e) =>
                      setCurrNote({ ...currNote, content: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate}>Add Note</Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {(search === "" ? notes : searchedNotes)?.length > 0 ? (
          (search === "" ? notes : searchedNotes).map((note) => (
            <Dialog key={note.id} open={editOpen} onOpenChange={setEditOpen}>
              <div
                onClick={() => {
                  setCurrNote(note);
                  setEditOpen(true);
                  console.log("nnote", note);
                }}
                className="block max-w-sm max-h-96 p-6 cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-3">
                  {note.topic}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 overflow-hidden text-ellipsis line-clamp-4">
                  {note.content}
                </p>
              </div>
              <DialogContent className="max-w-5xl w-[750px]">
                <DialogHeader>
                  <DialogTitle>Note</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 w-[700px]">
                  <div className="flex flex-col items-start gap-2 w-[700px]">
                    <Label htmlFor="name" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="name"
                      value={currNote?.topic}
                      onChange={(e) =>
                        setCurrNote({ ...currNote, topic: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <Label htmlFor="username" className="text-right">
                      Content
                    </Label>
                    <Textarea
                      id="username"
                      value={currNote?.content}
                      onChange={(e) =>
                        setCurrNote({ ...currNote, content: e.target.value })
                      }
                      className="col-span-3 h-60"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("why id", note.id, currNote);
                      deleteNote(note?.id ? note.id : "");
                    }}
                    variant="destructive"
                    className=""
                  >
                    Delete
                  </Button>
                  <Button onClick={updateNote}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))
        ) : (
          <p className="text-center text-gray-500">No notes found</p>
        )}
      </div>
    </div>
  );
};

export default Notes;