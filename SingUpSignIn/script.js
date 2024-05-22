const registerBtn = document.getElementById('register')
console.log(registerBtn)

const loginBtn = document.getElementById('login')
console.log(loginBtn)

registerBtn.addEventListener('click', () => 
    document.getElementById('container').classList.add('active'))

loginBtn.addEventListener('click', () => 
    document.getElementById('container').classList.remove('active'))