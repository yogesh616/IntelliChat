import { useState, useRef, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Lottie from 'react-lottie';
import logo from './assets/lottie.json';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './AudioPlayer.css'
import './popup.css'

function App() {
  const [prompt, setPrompt] = useState('');
  const [userInputs, setUserInputs] = useState([]);
  const [results, setResults] = useState([]);
  const [check, setCheck] = useState(0);
  const divRef = useRef(null);
  const [btnText, setButtonText] = useState('Send')
  const [images, setImages] = useState([]);
  const [hyperlinks, setHyperlinks] = useState([]);
  const [audioUrl, setAudioUrl] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
 
  
function handleOpen() {
  setIsOpen(true);
  console.log(isOpen)
}
function handleClose() {
  setIsOpen(false);
  console.log(isOpen)
}




  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: logo,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  async function getData() {
    try {
      setUserInputs(prev => [...prev, prompt]);
      const response = await axios.post('https://intelli-chat-server.vercel.app/', { prompt: prompt });
      console.log(response.data);
      setButtonText('Wait');
      setPrompt('');
      let i = 0;
      let currentResult = '';
      const textData = response.data.longestData
      const imagedata = response.data.yahooSummary.src
      const hyperlinkData = response.data.yahooSummary.href
      const audiourl = response.data.audioURL

      function type() {
        if (i < textData.length) {
          currentResult += textData.charAt(i);
          setResults(prev => {
            const newResults = [...prev];
            newResults[check] = currentResult;
            return newResults;
          });
          i++;
          setTimeout(type, 20);
        }
        else{
          setButtonText('Send');
          setImages((prev) => {
            const newImages = [...prev];
            newImages[check] = imagedata;
           // console.log('new images', newImages);
            return newImages;
          })
          setHyperlinks((prev) => {
            const newHyperLinks = [...prev];
            newHyperLinks[check] = hyperlinkData;
           // console.log('new hyperlinks', newHyperLinks);
            return newHyperLinks;

          })
          setAudioUrl((prev) => {
            const newAudioUrl = [...prev];
            newAudioUrl[check] = audiourl;
           // console.log('new hyperlinks', newHyperLinks);
            return newAudioUrl;

          })
        }
      }
      type();
      setCheck(prev => prev + 1);
    } catch (error) {
      console.log(error.message);
      
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      getData();
    }
  };
  useEffect(() => {
    if (divRef.current && results.length > 0) {
      divRef.current.scrollTo({ top: divRef.current.scrollHeight, behavior: 'smooth' });
      
    }
    
  }, [results]);

  return (
    <div className="app-container">
      <div ref={divRef} className="results-container">
      <Lottie options={defaultOptions} width={55} height={55} />
      
        {results.map((result, index) => (
          <div  className="result-item" key={index}>
            <div className="user-input">
              <p className="user-input-text">{userInputs[index]}</p>
            </div>
            <div className="result">
              <p className="result-text">{result}</p>
              {audioUrl[index] && <AudioPlayer src={audioUrl[index]} />}

                
              {hyperlinks[index] && images[index] &&  <a href={hyperlinks[index]} target='_blank' ><img className="img" src={images[index]} alt="Result" /> </a>}
            </div>
          </div>
        ))}
      </div>

      <div className="input-group">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKey}
          placeholder=" Message IntelliChat"
          className="input-field"
        />
        <button onClick={getData} className="send-button">
          {btnText}
        </button>
      </div>
      <div className='text-center mb-1'> 
         <p className='text-secondary my-2 opacity-75 info'>IntelliChat can make mistakes. <span style={{cursor: 'pointer'}} onClick={handleOpen} >Check important info. </span></p>
      </div>
       {/* Popup   */ }
       {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={handleClose}>
              &times;
            </span>
            <h2>Web Scraper Documentation</h2>
            <p>To find details for a person, write the name with "<strong>who is or was</strong>".</p>
            <p>To download a song, write "<strong>songname song mp3 download pagalfree</strong>".</p>
            <p>
              <strong>Note:</strong> <em>Pagalfree</em> is important for finding the audio file on the
              server.
            </p>
          </div>
        </div>
      )}
     
    </div>
  );
}

export default App;
