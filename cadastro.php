<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    try {
        // Conectar ao banco de dados
        $pdo = new PDO('mysql:host=localhost;dbname=desenvolvimentoweb', 'root', '');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Hash da senha
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

        // Preparar e executar a consulta
        $stmt = $pdo->prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
        $stmt->execute([$nome, $email, $senha_hash]);

        // Redirecionar para a tela de login após o cadastro
        header('Location: login.html');
        exit();

    } catch (PDOException $e) {
        // Exibir mensagem de erro, se houver
        echo "Erro ao cadastrar usuário: " . $e->getMessage();
    }

} else {
    http_response_code(405);
    echo "Método não permitido";
}
?>
