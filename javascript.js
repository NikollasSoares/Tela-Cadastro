function formatarCPF() {
    let input = document.getElementById("cpf");
    let inputValue = input.value.replace(/\D/g, "");
    let formattedValue = "";

    if (inputValue.length === 11) {
        formattedValue = inputValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
        formattedValue = inputValue;
    }

    input.value = formattedValue;
}

function cadastrar() {
    let cpf = document.getElementById("cpf").value;
    let firstName = document.getElementById("firstname").value;
    let lastName = document.getElementById("lastname").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        window.alert("As senhas não coincidem. Por favor, tente novamente.");
        return;
    } else if (cpf === "" || firstName === "" || lastName === "" || password === "") {
        window.alert("Por favor, preencha todos os campos.");
        return;
    } else {
        window.alert(`Cadastro realizado com sucesso!\nCPF: ${cpf}\nNome: ${firstName} ${lastName}`);
    }
}