import React, { useState } from 'react';
import './body.css';
import { Input } from '@chakra-ui/react';
import {GetPlaylistInfo} from '../../../Logic.js'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Button, ButtonGroup } from '@chakra-ui/react';

export const Body = () => {
  const [url, setUrl] = useState('');
  const [startVideo, setStartVideo] = useState('');
  const [endVideo, setEndVideo] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Get the values of the input fields
    const urlValue = url || null;
    const startVideoValue = startVideo || 0;
    const endVideoValue = endVideo || -1;
  
    // Store the values in a variable
    const formData = { url: urlValue, startVideo: startVideoValue, endVideo: endVideoValue };
    
    try {
      if(formData.url != null ){
        const result = await GetPlaylistInfo(formData);
        setResult(result);
        setShowResult(true);
      }
      else{
       const result = "Please enter a url in the input box!";
       setResult(result);
       setShowResult(true);
      }
      // console.log(result);
      
    } catch (error) {
      console.error('Error:', error);
    }
  
    // Clear the input boxes
    setUrl('');
    setStartVideo('');
    setEndVideo('');
  };
  return (
    <div className="Body">
      <h2>Find the duration of any youtube playlist:</h2>
      <div className="input-container">
        <Input
          placeholder='Enter Url here'
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <Button colorScheme='blue' className="button" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <p>Enter the playlist link to get it's duration<br />
      There is no limit on playlist length but the server might timeout</p>
      You can enter starting and ending video number in the playlist, or can leave blank either or both
      <div className="number-inputs">
        <NumberInput
          value={startVideo}
          onChange={(value) => setStartVideo(value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <NumberInput
          value={endVideo}
          onChange={(value) => setEndVideo(value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        
      </div>
      {showResult && (
        <div className="result">
          <div className="result-content" style={{ backgroundColor: '#f7f7f7', padding: '20px', border: '1px solid #ddd', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '15px', marginTop: '20px' }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
};