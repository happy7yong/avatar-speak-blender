// utils/textToSpeechUtils.js
import mapKoreanToShape from '../components/mapKoreanToShape'
import fetchTTS from '../components/fetchTTS'
import Hangul from 'hangul-js'

// 메인 함수: TTS 생성 + Whisper 타이밍 JSON 불러와 립싱크 생성
export function handleTextToSpeech(inputText, setCurrentPhoneme, setTimeline) {
    // 1. TTS 생성 및 mp3 저장
    fetchTTS(inputText, true) // true → mp3 저장도 실행됨

    // 2. Whisper 타이밍 JSON 불러오기 (tts_output.json은 public 폴더에 있어야 함)
    fetch('/tts_output.json')
        .then(res => res.json())
        .then((segments) => {
            const flatTimeline = []

            segments.forEach(({ text, start, end }) => {
                const jamos = splitHangulToJamo(text)
                const duration = end - start
                const perJamo = duration / jamos.length

                jamos.forEach((jamo, i) => {
                    const phoneme = mapKoreanToShape(jamo)
                    flatTimeline.push({
                        phoneme,
                        start: +(start + i * perJamo).toFixed(2),
                        end: +(start + (i + 1) * perJamo).toFixed(2)
                    })
                })
            })

            setTimeline(flatTimeline)
            playLipSyncTimeline(flatTimeline, setCurrentPhoneme)
        })
        .catch((err) => {
            console.error('Whisper 타이밍 데이터를 불러오지 못했습니다:', err)
        })
}

// 자모 분해 함수
function splitHangulToJamo(text) {
    return text.split('').flatMap(char => Hangul.disassemble(char)).filter(j => j.trim() !== '')
}

// 타이밍 기반 입모양 애니메이션 실행
function playLipSyncTimeline(timeline, setCurrentPhoneme) {
    timeline.forEach(({ phoneme, start, end }) => {
        setTimeout(() => {
            setCurrentPhoneme(phoneme)
        }, start * 1000)

        setTimeout(() => {
            setCurrentPhoneme('SLIENCE')
        }, end * 1000)
    })
}
