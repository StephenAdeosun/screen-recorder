// src/components/RecorderUI.js
import React, { useState, useRef } from 'react';
import {
  Box,
  Heading,
  Button,
  Image,
  Icon,
} from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa'; // Import icons

// Import your images here
// Import your image files here
import fullScreenImage from './assets/monitor.svg';
import currentTabImage from './assets/copy.svg';

function RecorderUI() {
  const [recordingOption, setRecordingOption] = useState('fullScreen');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false); // Track recording state

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
        },
        audio: isAudioEnabled,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        // You can now send the recorded video to your server using fetch or another method
        console.log('Recording stopped, URL:', url);
        chunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getAudioTracks().forEach((track) => {
        track.enabled = isAudioEnabled;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoEnabled;
      });
    }
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="lg" mb={4}>
        Screen Recorder
      </Heading>

      {/* Option to choose full screen */}
      <Button
        onClick={() => setRecordingOption('fullScreen')}
        variant={recordingOption === 'fullScreen' ? 'solid' : 'outline'}
        mb={4}
        mr={4}
      >
        <Image src={fullScreenImage} alt="Full Screen" boxSize="24px" mb={2} />
        Full Screen
      </Button>

      {/* Option to choose current tab */}
      <Button
        onClick={() => setRecordingOption('currentTab')}
        variant={recordingOption === 'currentTab' ? 'solid' : 'outline'}
        mb={4}
      >
        <Image src={currentTabImage} alt="Current Tab" boxSize="24px" mb={2} />
        Current Tab
      </Button>

      {/* Toggle audio */}
      <Button
        onClick={toggleAudio}
        variant="none"
        mb={4}
        mr={4}
      >
        <Icon as={isAudioEnabled ? FaMicrophone : FaMicrophoneSlash} boxSize={6} />
      </Button>

      {/* Toggle video */}
      <Button
        onClick={toggleVideo}
        variant="none"
        mb={4}
      >
        <Icon as={isVideoEnabled ? FaVideo : FaVideoSlash} boxSize={6} />
      </Button>

      {/* Start/Stop recording button */}
      <Button
        colorScheme={isRecording ? 'red' : 'blue'}
        onClick={isRecording ? handleStopRecording : handleStartRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
    </Box>
  );
}

export default RecorderUI;
