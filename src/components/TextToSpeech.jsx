// src/components/TextToSpeech.jsx
import React from 'react'

function TextToSpeech({ text, onEnd }) {
    // Google Cloud TTS API 호출
    async function fetchTTS(text) {
        const API_KEY = 'AIzaSyC5MCrRINOvp2nmDN7mDLOr_woIZMASqFM'
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`

        const body = JSON.stringify({
            input: { text: text },
            voice: { languageCode: 'ko-KR', name: 'ko-KR-Wavenet-A' },
            audioConfig: { audioEncoding: 'MP3' },
        })

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body,
        })

        const data = await response.json()

        if (data.error) {
            console.error('TTS API 에러:', data.error)
            return
        }

        const audioContent = data.audioContent
        const audio = new Audio('data:audio/mp3;base64,' + audioContent)

        // 음성 재생 후 onEnd 콜백 실행
        audio.play()
        audio.onended = onEnd
    }

    // TTS가 끝났을 때 onEnd 실행
    React.useEffect(() => {
        if (text) {
            fetchTTS(text)
        }
    }, [text])

    return null // 이 컴포넌트는 UI 없이 TTS만 처리
}

export default TextToSpeech
