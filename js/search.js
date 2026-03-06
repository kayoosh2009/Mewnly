lucide.createIcons();
        let html5QrCode = null;

        async function doSearch() {
            const query = document.getElementById('searchInput').value.trim();
            const resultsDiv = document.getElementById('results');

            if (query.length < 2) {
                resultsDiv.innerHTML = `<div style="text-align:center; margin-top:50px; opacity:0.3;"><p>Минимум 2 символа для поиска</p></div>`;
                return;
            }

            const users = await window.findUsers(query);
            
            if (users.length === 0) {
                resultsDiv.innerHTML = `<p style="text-align:center;">Пользователь не найден</p>`;
                return;
            }

            resultsDiv.innerHTML = users.map(user => `
                <div class="user-card">
                    <div class="u-avatar">
                        ${user.avatar ? `<img src="${user.avatar}">` : user.username[0].toUpperCase()}
                    </div>
                    <div class="u-info">
                        <span class="u-name">${user.realName || 'No Name'}</span>
                        <span class="u-nick">@${user.username}</span>
                    </div>
                    <button class="msg-btn" onclick="openChat('${user.username}')">
                        <i data-lucide="message-circle" size="18"></i> Написать
                    </button>
                </div>
            `).join('');
            lucide.createIcons();
        }

        function openChat(username) {
            // Логика: добавляем пользователя в список "недавних" и переходим на главную
            let recent = JSON.parse(localStorage.getItem('recent_chats') || '[]');
            if (!recent.includes(username)) recent.push(username);
            localStorage.setItem('recent_chats', JSON.stringify(recent));
            
            location.href = 'dash.html';
        }

        // Логика QR-Сканера
        function toggleScanner() {
            const readerDiv = document.getElementById('reader');
            if (readerDiv.style.display === 'block') {
                html5QrCode.stop();
                readerDiv.style.display = 'none';
            } else {
                readerDiv.style.display = 'block';
                html5QrCode = new Html5Qrcode("reader");
                html5QrCode.start(
                    { facingMode: "environment" }, 
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => {
                        document.getElementById('searchInput').value = decodedText;
                        doSearch();
                        toggleScanner(); // Выключаем после успеха
                    }
                );
            }
        }