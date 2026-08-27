// 현재 시간을 'YYYY.MM.DD HH:mm' 형식으로 변환해 주는 도구 함수
export function getCurrentFormattedTime(): string {
    const now = new Date(); // 👈 지금 이 순간의 진짜 시간 가져오기

    const year = now.getFullYear(); // 연도 (예: 2026)

    // getMonth()는 0부터 시작하므로 +1을 해주고, 두 자리 숫자로 맞춤 (예: 8 ➔ '08')
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // 일자 (예: 9 ➔ '09')
    const day = String(now.getDate()).padStart(2, '0');

    // 시 / 분
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
}