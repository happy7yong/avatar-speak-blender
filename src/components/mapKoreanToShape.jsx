import React from 'react'
// 한글 자모 → 입모양 이름 매핑
function mapKoreanToShape(jamo) {
    if ('ㅏㅑㅓㅕ'.includes(jamo)) return 'AA'
    if ('ㅗㅛㅜㅠㅡ'.includes(jamo)) return 'OO'
    if ('ㅣㅐㅔ'.includes(jamo)) return 'EE'
    if ('ㅁㅂㅍ'.includes(jamo)) return 'FV'
    if ('ㄱㅋㅎㄷㄴㄹㅇㅅㅆㅈㅊㅌ'.includes(jamo)) return 'SLIENCE'
    return 'SLIENCE'
}

export default mapKoreanToShape