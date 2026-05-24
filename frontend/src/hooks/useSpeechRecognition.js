import { useEffect, useRef, useState } from "react";

const useSpeechRecognition = () => {

  const [isListening, setIsListening] =
    useState(false);

  const [transcript, setTranscript] =
    useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      console.log(
        "Speech Recognition not supported"
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";

    recognition.onresult = (event) => {

      let finalTranscript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {

        finalTranscript +=
          event.results[i][0].transcript + " ";
      }

      setTranscript(finalTranscript);
    };

    recognition.onend = () => {

      setIsListening(false);
    };

    recognitionRef.current =
      recognition;

  }, []);

  const startListening = () => {

    if (
      recognitionRef.current
    ) {

      recognitionRef.current.start();

      setIsListening(true);
    }
  };

  const stopListening = () => {

    if (
      recognitionRef.current
    ) {

      recognitionRef.current.stop();

      setIsListening(false);
    }
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
  };
};

export default useSpeechRecognition;