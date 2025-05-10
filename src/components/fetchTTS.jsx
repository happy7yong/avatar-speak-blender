// src/components/fetchTTS.jsx
import React from 'react'

// TTS 발음 처리
async function fetchTTS(text, saveFile = false) {
    const API_KEY = 'AIzaSyC5MCrRINOvp2nmDN7mDLOr_woIZMASqFM'
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`

    const body = JSON.stringify({
        input: { text: text },
        voice: { languageCode: 'ko-KR', name: 'ko-KR-Standard-D' },
        audioConfig: { audioEncoding: 'MP3' },
    })

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
    })

    const data = await response.json()

    const audioContent = data.audioContent
    const byteArray = Uint8Array.from(atob(audioContent), c=>c.charCodeAt(0))
    const blob = new Blob([byteArray],{type: 'audio/mp3'})

    //mp3 저장용
    if(saveFile){
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href=url
        a.download='tts_output.mp3'
        document.body.appendChild(a)
        a.click()
        a.remove()
    }

    //음성 재생용
    const audio = new Audio(URL.createObjectURL(blob))
    audio.play()

    return blob //반환하여 Whisper에 넘김

}

export default fetchTTS
