"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [currNote, setCurrNote] = useState();
  const [search, setSearch] = useState("");
  const [searchedNotes, setSearchedNotes] = useState("");

  const getNotes = async () => {
    const value = await axios.get("http://localhost:3000/user/my-notes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the Bearer token in the Authorization header
      },
    });
    const data = value.data;
    setNotes(data);

    console.log("make note", data);
  };
  const deleteNote = async (id) => {
    const value = await axios.delete(
      `http://localhost:3000/user/my-notes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the Bearer token in the Authorization header
        },
      }
    );
    const data = value.data;
    getNotes();

    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    console.log("make note", data);
  };

  const createNote = async () => {
    const value = await axios.post(
      "http://localhost:3000/user/my-notes",
      {
        topic: "notes",
        content: "bla bla bla",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the Bearer token in the Authorization header
        },
      }
    );
    const data = value.data;
    getNotes();

    setNotes([...notes, data]);

    console.log("make note", data);
  };

  // const updateNote = async (id) => {
  const updateNote = async () => {
    if (!currNote) return;

    const value = await axios.patch(
      `http://localhost:3000/user/my-notes/${currNote.id}`,
      {
        topic: currNote.topic,
        content: currNote.content,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the Bearer token in the Authorization header
        },
      }
    );
    const data = value.data;
    getNotes();

    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === currNote.id ? data : note))
    );
    console.log("make note", data);
  };

  useEffect(() => {
    // axios.
    getNotes();
  }, []);

  useEffect(() => {
    setSearchedNotes(
      notes.filter(
        (note) => note.topic.includes(search) || note.content.includes(search)
      )
    );
  }, [search]);

  return (
    <div>
      <div className="">
        <h1 className="text-xl font-bold">Search</h1>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Button onClick={createNote}>Add </Button>
      <Button onClick={getNotes}>get </Button>
      <Button onClick={updateNote}>update </Button>
      <Button onClick={deleteNote}>del </Button>
      <div className="grid grid-cols-[1fr_3fr]">
        <div className="">
          <p className="">Notebooks</p>

          <div className="h-96 overflow-y-scroll space-y-2">
            {search === "" ? (
              notes.length === 0 ? (
                <p>No notes</p>
              ) : (
                notes.map((note) => (
                  <div
                    className="cursor-pointer bg-yellow-100 hover:bg-yellow-300"
                    onClick={() => setCurrNote(note)}
                  >
                    <p>
                      {note.id}-{note?.topic}
                    </p>
                    <Button onClick={() => deleteNote(note.id)}>Delete</Button>
                  </div>
                ))
              )
            ) : searchedNotes.length === 0 ? (
              <p>No notes</p>
            ) : (
              searchedNotes.map((note) => (
                <div
                  className="bg-yellow-100"
                  onClick={() => setCurrNote(note)}
                >
                  <p>
                    {note.id}-{note?.topic}
                  </p>
                  <Button onClick={() => deleteNote(note.id)}>Delete</Button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className=" bg-blue-300">
          {currNote && (
            <div className="flex flex-col items-center h-full">
              {/* <div className="flex flex-col items-center flex-1"> */}
              <div className="grid grid-rows-[auto_1fr] w-[80%] h-full">
                <h1 className="text-xl font-bold">
                  {currNote.id} -{/* {currNote.topic} */}
                  <Input
                    value={currNote.topic}
                    onChange={(e) =>
                      setCurrNote({ ...currNote, topic: e.target.value })
                    }
                  />
                </h1>
                {/* <p>{currNote.content}</p> */}
                <Textarea
                className="my-4"
                  value={currNote.content}
                  onChange={(e) =>
                    setCurrNote({ ...currNote, content: e.target.value })
                  }
                />
              </div>
              <Button onClick={updateNote}>Update</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Notes;
