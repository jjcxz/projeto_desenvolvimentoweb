<?php
$servidor = "localhost";
$usuario = "root"; // ajuste para seu servidor MySQL
$senha = ""; // ajuste para sua senha do MySQL
$banco = "desenvolvimentoweb";

$conexao = new mysqli($servidor, $usuario, $senha, $banco);

if ($conexao->connect_error) {
    die("Falha na conexão: " . $conexao->connect_error);
}
?>