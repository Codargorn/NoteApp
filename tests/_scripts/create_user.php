<?php


require_once __DIR__ . '/../../vendor/autoload.php';


$settings = require __DIR__ . '/../../config/database.php';

$pdo = \NotesApi\MysqlConnection::fromConfig($settings);


$userRepository = new \NotesApi\UserRepository($pdo);

$userRepository->createNewUser('tester@tag24.de', 'test123.');