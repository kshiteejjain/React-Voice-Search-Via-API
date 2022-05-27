import { useEffect, useState } from 'react';
import './App.css';
import placeholderImg from './assets/placeholder.png';
import soundWave from './assets/sound-wave.gif';
import loader from './assets/loader.gif';
import useSpeechToText from 'react-hook-speech-to-text';

function App() {

  const [isLoaded, setIsLoaded] = useState(false);
  const [newsResult, setNewsResult] = useState([]);
  const [voiceResult, setVoiceResult] = useState('')
  

  const apiKey = 'ca688f54ae164bc5b86b4bd4f399e67d';


  // speech recognition
  const {error, isRecording, results, startSpeechToText, stopSpeechToText, } = useSpeechToText({
    continuous: false,
    useLegacyResults: false,
    timeout: 500,
  });



  useEffect(() => {
    console.log(results);
    setVoiceResult(results)
  },[results]);

  useEffect(() => {

    const callNewsApi = async () => {
      setIsLoaded(true);
      const url = (`https://newsapi.org/v2/everything?q=${voiceResult[voiceResult.length -1]?.transcript}&sortBy=publishedAt&apiKey=${apiKey}`);
      await fetch(url)
        .then(res => res.json())
        .catch(err => alert(err))
        .then(
          (apiResult) => {
            setIsLoaded(false);
            setNewsResult(apiResult.articles);
            console.log(apiResult);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          
        )
    }
    
    // eslint-disable-next-line no-lone-blocks
    {voiceResult[voiceResult.length -1]?.transcript.length > 1 && callNewsApi()}
  },[voiceResult]);

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;




  return (
    <div className="App flex justify-between wrapper">
      <div className="about-project">
      <h1>Voice User Interface</h1>
      <p>This project have an ability to fetch any data from your voice like how an Alexa gets results <br /> for you based on your voice keyword.</p>
      <p>This is a Voice based news searching project built on React and we are very excited to launch it.</p>
      <p style={{color: "#b6b6b6"}}><strong>Note:</strong> Sometimes it will throw an error because it gets exceed the limit of trial API call, <br />it will get restored in 12 hours automatically and it will start working fine.</p>
      <div className="footer">
        <p>Made with <span className='red'>❤</span> by Kshiteej Jain </p>
        <a href="https://www.linkedin.com/in/kshiteejjain/" target="_blank" rel="noopener noreferrer">Linkedin</a>
        <a href="https://github.com/kshiteejjain" target="_blank" rel="noopener noreferrer">Github</a>
        <a href="mailto:kshiteejjain@gmail.com" target="_blank" rel="noopener noreferrer">Email</a>
      </div>
      </div>
<div className='right-section'>
{isRecording && <img src={soundWave} alt='Recording is on' className='wave-img' />} 
      {/* <h1>Recording: {isRecording.toString()}</h1> */}
      <button className='btn-primary' onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div className='flex recorded-keyword-div'>
      <ul className='recorded-keyword'>
        {results.slice(-1).map((result) => (
          <li key={result.timestamp}> Recorded Keyword is: <strong>{result.transcript}</strong></li>
        ))}
        {/* {interimResult && <li>{ interimResult}</li>} */}
      </ul>
      </div>

      {newsResult.length !== 0 ? <div className='searchResult'>
        {/* {inputText ? <h2>Your Search Keyword is: {inputText}</h2> : null} */}
        {voiceResult.length === 0 ? null  : newsResult.length === 0 ? <p>No result found</p> : isLoaded === false ? null : <p>No result found</p> }

        <ul>
          {newsResult.map((item, index) => (
            <li key={index}> 
            <span className="flex">
              {item.urlToImage ? <img src={item.urlToImage} className='thumbnail' alt={item.author} /> : <img src={placeholderImg} className='thumbnail' alt='Placeholder' />}
              <span>
              <h2>{item.author}</h2>
              <p>{item.description} </p>
              </span>
            </span>
            </li>
          ))}
        </ul>
        {isLoaded && <div className='loader-div'><img src={loader} alt="loader" width='55' /> </div>}
      </div>  : null}

      

</div>
      
    </div>
  );
}

export default App;
