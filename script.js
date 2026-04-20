// ここにバックエンドのURLを入力
const API_URL = '';

document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendButton');
    const refreshButton = document.getElementById('refreshButton');

    sendButton.addEventListener('click', postData);
    refreshButton.addEventListener('click', refreshData);

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
        const response = await fetch(API_URL, {
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
    const historyList = document.getElementById('historyList');

    try {
        const response = await fetch(API_URL);

        if (response.ok) {
            const data = await response.json();

            historyList.innerHTML = "";  // 履歴を一度空にする
            data.forEach(item => {
                const li = document.createElement('li');

                // JSONのラベル => {時刻},{コンテンツ}
                li.textContent = `${at} : ${content}`;

                historyList.appendChild(li);
            });
        } 
    } catch (error) {
        console.error("取得エラー:", error);
    }
}