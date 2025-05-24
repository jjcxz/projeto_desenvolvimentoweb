<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    try {
    
        $pdo = new PDO('mysql:host=localhost;dbname=desenvolvimentoweb', 'root', '');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

     
        $stmt = $pdo->prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
        $stmt->execute([$nome, $email, $senha_hash]);

        header('Location: login.html');
        exit();

    } catch (PDOException $e) {
        
        echo "Erro ao cadastrar usuário: " . $e->getMessage();
    }

} else {
    http_response_code(405);
    echo "Método não permitido";
}
?>
