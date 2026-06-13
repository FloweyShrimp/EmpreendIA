const cadastroForm = document.getElementById('cadastroForm');

cadastroForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('emailCadastro').value;
  const password = document.getElementById('senhaCadastro').value;

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    alert('Conta criada com sucesso!');
    window.location.href = '.././login/login.html';
  } catch (error) {
    alert(error.message);
  }
});

const googleCadastroBtn = document.getElementById('googleCadastro');

googleCadastroBtn.addEventListener('click', async () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    await auth.signInWithPopup(provider);
    alert('Conta criada com Google!');
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  }
});
