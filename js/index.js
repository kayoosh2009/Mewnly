    let isLogin = true;
    let base64Avatar = "";
    let redirectOnClose = false;

    // Авто-вход
    if (localStorage.getItem('mewnly_user')) {
        window.location.href = 'html/captcha.html';
    } else {
        document.getElementById('main-container').style.display = 'block';
        lucide.createIcons();
    }

    function togglePass(id, el) {
        const inp = document.getElementById(id);
        inp.type = inp.type === "password" ? "text" : "password";
        el.classList.toggle('active');
    }

    function previewFile() {
        const file = document.getElementById('file-input').files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            document.getElementById('avatar-preview').src = reader.result;
            document.getElementById('avatar-preview').classList.remove('hidden');
            document.getElementById('plus').classList.add('hidden');
            base64Avatar = reader.result;
        }
        if (file) reader.readAsDataURL(file);
    }

    function toggleMode() {
        isLogin = !isLogin;
        document.getElementById('reg-fields').classList.toggle('hidden');
        document.getElementById('confirm-group').classList.toggle('hidden');
        document.getElementById('title').innerText = isLogin ? 'Mewnly' : 'Join Mewnly';
        document.getElementById('main-btn').innerText = isLogin ? 'Log In' : 'Continue';
        document.getElementById('switch-link').innerText = isLogin ? 'Create Account' : 'Log In';
        document.getElementById('seed-display').style.display = 'none';
    }

    function showModal(type, title, text, redirect = false) {
        const overlay = document.getElementById('modalOverlay');
        const iconBox = document.getElementById('modalIconBox');
        const icon = document.getElementById('modalIcon');
        
        redirectOnClose = redirect;
        iconBox.className = type === 'success' ? 'result-icon icon-success' : 'result-icon icon-error';
        icon.setAttribute('data-lucide', type === 'success' ? 'check-circle-2' : 'alert-circle');
        
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalText').innerText = text;
        
        overlay.classList.add('active');
        lucide.createIcons();
    }

    function closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        if (redirectOnClose) {
            window.location.href = 'html/captcha.html';
        }
    }

    async function handleAction() {
        const user = document.getElementById('username').value.trim().toLowerCase();
        const pass = document.getElementById('password').value;
        const btn = document.getElementById('main-btn');

        if (!user || !pass) return showModal('error', 'Ошибка', 'Заполните все поля!');

        btn.disabled = true;
        btn.innerText = "Processing...";

        try {
            if (isLogin) {
                const querySnapshot = await window.getUserByNick(user);
                if (querySnapshot.empty) throw new Error("Пользователь не найден");
                
                const userData = querySnapshot.docs[0].data();
                await window.firebaseLogin(userData.email, pass);
                
                localStorage.setItem('mewnly_user', user);
                showModal('success', 'Вход выполнен', 'Добро пожаловать!', true);

            } else {
                const seedBox = document.getElementById('seed-display');
                if (seedBox.style.display !== 'block') {
                    if (await window.isUsernameTaken(user)) throw new Error("Никнейм уже занят!");
                    
                    const words = ["alpha", "arctic", "atlas", "aurora", "axis", "azure", "beacon", "boreal", "bullet", "canyon", "carbon", "cobalt", "comet", "copper", "cosmic", "crater", "crypto", "crystal", "cyber", "delta", "digit", "dragon", "drift", "eagle", "echo", "eclipse", "ember", "engine", "energy", "enigma", "ethnic", "falcon", "fiber", "flame", "flare", "flash", "flight", "fossil", "frozen", "fusion", "galaxy", "gamma", "ghost", "glacier", "glass", "gravity", "grid", "habit", "helix", "hollow", "horizon", "hybrid", "hyper", "icon", "igloo", "impact", "indigo", "infinity", "infra", "ivory", "jet", "jewel", "jester", "jump", "jungle", "karma", "keen", "kinetic", "lava", "legend", "lens", "leopard", "level", "light", "lunar", "macro", "magic", "magnet", "magma", "mantle", "marble", "marine", "mars", "master", "medal", "melody", "metal", "meteor", "micro", "mind", "mirror", "mist", "mobile", "modern", "module", "moment", "moon", "motive", "mountain", "mystic"];
                    const seed = Array.from({length: 12}, () => words[Math.floor(Math.random()*words.length)]).join(" ");
                    
                    seedBox.innerText = "SAVE YOUR SEED:\n\n" + seed;
                    seedBox.style.display = 'block';
                    btn.disabled = false;
                    btn.innerText = "I saved it. Finalize Register";
                    return;
                }

                const email = `${user}@mewnly.internal`;
                const userCredential = await window.firebaseRegister(email, pass);
                
                await window.saveUserData(userCredential.user.uid, {
                    username: user,
                    email: email,
                    realName: document.getElementById('realname').value,
                    birthDate: document.getElementById('birthdate').value,
                    avatar: base64Avatar,
                    seed: seedBox.innerText,
                    createdAt: new Date().toISOString()
                });

                localStorage.setItem('mewnly_user', user);
                showModal('success', 'Аккаунт создан', 'Теперь нужно пройти проверку', true);
            }
        } catch (e) {
            showModal('error', 'Ошибка', e.message);
            btn.disabled = false;
            btn.innerText = isLogin ? "Log In" : "Continue";
        }
    }