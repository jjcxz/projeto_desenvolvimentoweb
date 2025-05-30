<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    $pdo = new PDO('mysql:host=localhost;dbname=desenvolvimentoweb', 'root', '');
    $stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    if ($usuario && password_verify($senha, $usuario['senha'])) {
        echo "Login realizado com sucesso!";
        header('Location: ../html/paginainicial.html');
        exit();
    } else {
        echo "Email ou senha incorretos.";
    }
} else {
    http_response_code(405);
    echo "Método não permitido";
}
?>