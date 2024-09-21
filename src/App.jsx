import { useState, useRef, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Lottie from 'react-lottie';
import logo from './assets/lottie.json';

function App() {
  const [prompt, setPrompt] = useState('');
  const [userInputs, setUserInputs] = useState([]);
  const [results, setResults] = useState([]);
  const [check, setCheck] = useState(0);
  const divRef = useRef(null);
  const [btnText, setButtonText] = useState('Send')
  const [images, setImages] = useState([]);
  const [hyperlinks, setHyperlinks] = useState([]);
  
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
     // console.log(response.data);
      setButtonText('Wait');
      setPrompt('');
      let i = 0;
      let currentResult = '';
      const textData = response.data.longestData
      const imagedata = response.data.yahooSummary.src
      const hyperlinkData = response.data.yahooSummary.href
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
         <p className='text-secondary my-2 opacity-75 info'>IntelliChat can make mistakes. Check important info.</p>
      </div>
     
    </div>
  );
}

export default App;
