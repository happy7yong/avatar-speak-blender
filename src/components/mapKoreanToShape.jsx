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
/*
* function mapKoreanToShape(jamo) {
    if ('ㅁㅂㅍ'.includes(jamo)) return 'M'
    if ('ㅏㅑ'.includes(jamo)) return 'A'
    if ('ㅔㅐㅣ'.includes(jamo)) return 'E'
    if ('ㅗㅛ'.includes(jamo)) return 'O'
    if ('ㅜㅠ'.includes(jamo)) return 'U'
    if ('ㄹ'.includes(jamo)) return 'L'
    if ('ㅅㅆㅈㅊ'.includes(jamo)) return 'S'
    if ('ㅎ'.includes(jamo)) return 'H'
    if ('ㄴㅇ'.includes(jamo)) return 'N'
    return 'SIL'
}

* */
export default mapKoreanToShape