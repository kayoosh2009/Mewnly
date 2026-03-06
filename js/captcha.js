if (localStorage.getItem('mewnly_verified') === 'true') {
        window.location.href = "app/dash.html";
    } else {
        document.getElementById('captchaBox').style.display = 'block';
        lucide.createIcons();
    }

    const images = {
        femboy: [
            "https://i.pinimg.com/736x/94/6a/26/946a26b67c40828182577ab68462bf54.jpg",
            "https://i.pinimg.com/1200x/8e/76/28/8e7628fd6ae191d8329701c22d1f45ae.jpg",
            "https://i.pinimg.com/736x/68/af/2b/68af2babcd6eafbb3c0b54f7c4d14149.jpg",
            "https://i.pinimg.com/736x/ed/74/a3/ed74a3cacfb1f0c0f6519fa2e03e4586.jpg"
        ],
        other: [
            "https://i.pinimg.com/736x/b1/5d/50/b15d50b028c6aaa61caf567c9e23ef12.jpg",
            "https://i.pinimg.com/736x/86/5d/6d/865d6d55a2f1be71f05b695212b42daf.jpg",
            "https://i.pinimg.com/1200x/af/dd/a2/afdda2da527a42886cb1c1109e967e59.jpg",
            "https://i.pinimg.com/736x/80/9a/a6/809aa66523182c99fcd264d1617cabf0.jpg",
            "https://i.pinimg.com/736x/4c/c8/ac/4cc8acfdc01e651cbfaad9a40b5227e9.jpg"
        ]
    };

    let selectedCells = new Set();
    let correctCells = new Set();
    let isSuccess = false;

    function generateGrid() {
        const grid = document.getElementById('grid');
        grid.innerHTML = '';
        selectedCells.clear();
        correctCells.clear();
        let pool = [];
        images.femboy.forEach(url => pool.push({ url, isTarget: true }));
        images.other.forEach(url => pool.push({ url, isTarget: false }));
        pool.sort(() => Math.random() - 0.5);
        pool.forEach((item, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.innerHTML = `<img src="${item.url}">`;
            cell.onclick = () => {
                if (selectedCells.has(index)) {
                    selectedCells.delete(index);
                    cell.style.borderColor = 'transparent';
                    cell.style.padding = '0';
                } else {
                    selectedCells.add(index);
                    cell.style.borderColor = 'var(--accent)';
                    cell.style.padding = '4px';
                }
            };
            if (item.isTarget) correctCells.add(index);
            grid.appendChild(cell);
        });
    }

    function showModal(status) {
        const overlay = document.getElementById('modalOverlay');
        const iconBox = document.getElementById('modalIconBox');
        const icon = document.getElementById('modalIcon');
        const title = document.getElementById('modalTitle');
        const text = document.getElementById('modalText');

        if (status === 'success') {
            isSuccess = true;
            iconBox.className = 'result-icon icon-success';
            icon.setAttribute('data-lucide', 'check-circle-2');
            title.innerText = 'Проверка пройдена';
            text.innerText = 'Добро пожаловать обратно в Mewnly.';
        } else {
            isSuccess = false;
            iconBox.className = 'result-icon icon-error';
            icon.setAttribute('data-lucide', 'x-circle');
            title.innerText = 'Ошибка';
            text.innerText = 'Похоже, вы ошиблись. Попробуйте выбрать картинки снова.';
        }
        
        overlay.classList.add('active');
        lucide.createIcons();
    }

    function closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        if (isSuccess) {
            window.location.href = "app/dash.html";
        } else {
            generateGrid();
        }
    }

    function checkCaptcha() {
        const result = correctCells.size === selectedCells.size && 
                          [...correctCells].every(value => selectedCells.has(value));

        if (result) {
            localStorage.setItem('mewnly_verified', 'true');
            showModal('success');
        } else {
            showModal('error');
        }
    }

    if (localStorage.getItem('mewnly_verified') !== 'true') {
        generateGrid();
    }