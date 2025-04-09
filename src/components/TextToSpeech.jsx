// src/components/TextToSpeech.jsx
import React from 'react'

function TextToSpeech({ text, onEnd, handleClick }) {
    // TTS 발음 처리
    async function fetchTTS(text) {
        const API_KEY = 'AIzaSyC5MCrRINOvp2nmDN7mDLOr_woIZMASqFM'
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`

        const body = JSON.stringify({
            input: {text: text},
            voice: {languageCode: 'ko-KR', name: 'ko-KR-Wavenet-A'},
            audioConfig: {audioEncoding: 'MP3'},
        })

        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body,
        })

        const data = await response.json()

        if (data.error) {
            console.error('TTS API 에러:', data.error)
            return
        }

        const audioContent = data.audioContent
        const audio = new Audio('data:audio/mp3;base64,' + audioContent)
        audio.play()
        audio.onended = onEnd  // TTS가 끝났을 때 콜백
    }


    return null
}

export default TextToSpeech
