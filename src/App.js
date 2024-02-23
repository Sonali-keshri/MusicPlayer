import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaTrashAlt } from 'react-icons/fa';


// using local storage to set and get data 
const useLocalStorage = (key, initialValue) => {
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  const [value, setValue] = useState(initial);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useLocalStorage('playlist', []);
  const [currentTrackIndex, setCurrentTrackIndex] = useLocalStorage('currentTrackIndex', 0);
  const [currentTime, setCurrentTime] = useLocalStorage('currentTime', 0);

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleAudioEnd = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handlePlay = () => {
    const audio = document.getElementById('audio-player');

    if (playlist.length > 0 && audio) {
      if (audio.paused || audio.ended) {
        audio.src = playlist[currentTrackIndex].url;
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    } else {
      console.error('Playlist is empty or audio element not found');
    }
  };

  const handlePause = () => {
    const audio = document.getElementById('audio-player');
    if (audio) {
      audio.pause();
    }
  };

  const playNextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const playPrevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(playlist.length - 1);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPlaylist([...playlist, ...newFiles]);
    setCurrentTrackIndex(0);
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentTrackIndex(0);
    setCurrentTime(0);
  };

  return (
    <>

      <div className='py-10'>
        <div className='lg:w-3/5 lg:p-0 p-4  mx-auto'>
          <h1 className='text-3xl pb-4'>Audio Player</h1>
          <input type="file" accept="audio/*" onChange={handleFileChange} multiple />
        </div>
        <div className='flex md:flex-row flex-col items-center gap-10 lg:w-3/5 w-full mx-auto bg-green-300 py-10 md:pl-4'>
          <div className='md:w-5/12 w-full md:p-0 px-28 '>
            <img src="https://th.bing.com/th/id/OIP.mH31yrEzqgC2vDctscxNuQHaHa?rs=1&pid=ImgDetMain" alt="music" className='w-full h-2/3 ' />
            <div className='bg-slate-900 flex flex-col items-center mt-2 justify-center p-3'>
              <audio
                id="audio-player"
                controls
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleAudioEnd}
                src={playlist[currentTrackIndex]?.url}
                className=' p-3'
              ></audio>
              <div className='actionBtn'>
                <button onClick={handlePlay}><FaPlay /></button>
                <button onClick={handlePause}><FaPause /></button>
                <button onClick={playPrevTrack}><FaStepBackward /></button>
                <button onClick={playNextTrack}><FaStepForward /></button>
              </div>
            </div>
          </div>
          <div className='md:w-1/2 w-3/4 md:p-0 p-4 '>
            <h2 className='text-3xl font-semibold bg-slate-900 text-white p-2 text-center '>Music Playlist</h2>
            <ol className=' h-[300px] overflow-y-scroll mb-10 mt-4'>
              {playlist.map((track, index) => (
                <li key={index} onClick={() => setCurrentTrackIndex(index)}>
                  {index + 1}. {index === currentTrackIndex ? (
                    <strong>{track.name}</strong>
                  ) : (
                    <span>{track.name}</span>
                  )}
                </li>
              ))}
            </ol>
          <button className='bg-red-600 hover:opacity-75 text-white p-2 rounded-md ' onClick={clearPlaylist}>Clear Playlist</button>
          </div>
        </div>
      </div>

    </>
  );
};

export default AudioPlayer;
