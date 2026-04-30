// ここにバックエンドのURLを入力
const BASE_URL = 'http://127.0.0.1:8000';
const ENDPOINTS = {
    TEXT : `${BASE_URL}/text`,
    TESTS : `${BASE_URL}/texts`
};

document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendButton');
    const refreshButton = document.getElementById('refreshButton');

    sendButton.addEventListener('click', postData);
    refreshButton.addEventListener('click', fetchHistory);

    fetchHistory();
});

// データの送信
async function postData() {
    const inputElement = document.getElementById('messageInput');
    const text = inputElement.value;

    if (!text) {
        alert("文字を入力してください。");
        return;
    }

    try {
        const response = await fetch(ENDPOINTS.TEXT, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content: text})
        });

        if (response.ok) {
            console.log("送信成功");
            inputElement.value = "";  // 入力欄を空にする
            fetchHistory();
        } else {
            console.error("送信失敗:", response.status);
        }
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }
}

// 履歴の取得・更新
async function fetchHistory() {
    const historyListAt = document.getElementById('historyListAt');
    const historyListContent = document.getElementById('historyListContent');

    try {
        const response = await fetch(ENDPOINTS.TEXTS);

        if (response.ok) {
            const data = await response.json();

            historyListAt.innerHTML = "";
            historyListContent.innerHTML = "";
            data.forEach(item => {
                const liAt = document.createElement('li');
                const liContent = document.createElement('li');

                // JSONのラベル => {時刻},{コンテンツ}
                liAt.textContent = item.time; // "time"というラベル名
                liContent.textContent = item.content;  // "content"

                historyListAt.appendChild(liAt);
                historyListContent.appendChild(liContent);
            });
        } else {
            alert("履歴の取得に失敗しました。ステータス：" + response.status)
        }
    } catch (error) {
        console.error("取得エラー:", error);
    }
}