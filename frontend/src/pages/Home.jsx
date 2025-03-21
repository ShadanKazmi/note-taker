import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Search from '../components/Search';
import Notes from '../components/Notes';
import { MdOutlineDraw } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";
import EditModal from '../components/EditModal';
import Note from '../components/Note';
import { LuSlidersHorizontal } from "react-icons/lu";
import { FourSquare } from 'react-loading-indicators';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notesData, setNotesData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const userId = Cookies.get("userId");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`https://note-taker-bdon.onrender.com/notes/${userId}`);
      setNotesData(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (newNote) => {
    try {
      const response = await axios.post('https://note-taker-bdon.onrender.com/notes', newNote);
      setNotesData([...notesData, response.data]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const openNote = (note) => {
    setSelectedNote(note);
  };

  const closeNote = () => {
    setSelectedNote(null);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSort = () => {
    const sortedNotes = [...notesData].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setNotesData(sortedNotes);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleNoteDelete = (deletedNoteId) => {
    setNotesData(notesData.filter(note => note._id !== deletedNoteId));
  };

  const handleFav = async (note) => {
    try {
      const updatedNote = { ...note, favourite: !note.favourite };
  
      await axios.put(`https://note-taker-bdon.onrender.com/notes/${note._id}`, updatedNote);
  
      setNotesData((prevNotes) =>
        prevNotes.map((n) =>
          n._id === note._id ? { ...n, favourite: !n.favourite } : n
        )
      );
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };
  
  

  return (
    <div className="flex flex-col h-full">
      <Search />

      <div className="text-right px-4">
        <button
          onClick={handleSort}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-300 focus:outline-none"
        >
          <LuSlidersHorizontal className="text-lg" />
          <span className='font-bold'>{`${sortOrder === 'asc' ? 'Sorting by New' : 'Sorting by Oldest'}`}</span>
        </button>
      </div>

{/*       {loading ? (
        <div className='flex justify-center mt-auto mb-auto'>
        <FourSquare color="#9831cc" size="large" textColor="" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 overflow-y-auto h-[calc(100vh-200px)] custom-scrollbar">
          {notesData.map((note) => (
            <Notes
              key={note._id}
              Title={note.title}
              CreatedAt = {note.createdAt}
              TextContent={note.textContent}
              Image={note.imageFile}
              Audio={note.audioFile}
              Transcript={note.audioTranscript}
              onClick={() => openNote(note)}
              toggle={toggleModal}
              fav = {() => handleFav(note)}
              isFav={note.favourite}
            />
          ))}
        </div>
      )} */}

      {userId ? (
      loading ? (
        <div className="flex justify-center mt-auto mb-auto">
          <FourSquare color="#9831cc" size="large" textColor="" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 overflow-y-auto h-[calc(100vh-200px)] custom-scrollbar">
          {notesData.map((note) => (
            <Notes
              key={note._id}
              Title={note.title}
              CreatedAt={note.createdAt}
              TextContent={note.textContent}
              Image={note.imageFile}
              Audio={note.audioFile}
              Transcript={note.audioTranscript}
              onClick={() => openNote(note)}
              toggle={toggleModal}
              fav={() => handleFav(note)}
              isFav={note.favourite}
            />
          ))}
        </div>
      )
    ) : (
      <div className="flex flex-col items-center justify-center mt-auto mb-auto text-gray-600">
        <p className="text-lg font-semibold">You need to sign up or log in to create and view notes.</p>
      </div>
    )}

{/*       <div className="flex items-center justify-between mt-1 mx-16 px-6 py-3 bg-white-100 border border-gray-300 rounded-full shadow-md">
        <div className="flex items-center space-x-4 text-gray-600">
          <MdOutlineDraw className="text-2xl cursor-pointer" onClick={toggleModal} />
          <FaRegImage className="text-2xl cursor-pointer" onClick={toggleModal} />
        </div>
        <div
          className="flex items-center justify-center px-4 py-1 bg-red-500 text-white rounded-full cursor-pointer"
          onClick={toggleModal}
        >
          <AiFillAudio />
        </div>
      </div> */}

      <div className="mt-auto mx-16 px-6 py-3 bg-white-100 border border-gray-300 rounded-full shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-600">
            <MdOutlineDraw className="text-2xl cursor-pointer" onClick={toggleModal} />
            <FaRegImage className="text-2xl cursor-pointer" onClick={toggleModal} />
          </div>
          <div
          className="flex items-center justify-center px-4 py-1 bg-red-500 text-white rounded-full cursor-pointer"
          onClick={toggleModal}>
            <AiFillAudio />
          </div>
        </div>
      </div>

      {isModalOpen && <EditModal toggleModal={toggleModal} createNote={createNote} />}

      {selectedNote && <Note noteData={selectedNote} closeNote={closeNote} onNoteDelete={handleNoteDelete} />}
    </div>
  );
};

export default Home;
