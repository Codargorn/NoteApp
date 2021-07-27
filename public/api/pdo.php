<?php declare(strict_types=1);

use NotesApi\MysqlConnection;
use NotesApi\Note;
use NotesApi\NotesRepository;

require_once __DIR__ . '/../../vendor/autoload.php';

$settings = require __DIR__ . '/../../config/database.php';


$pdo = MysqlConnection::fromConfig($settings);

$repository = new NotesRepository($pdo);

$note = new Note(
    1,
    'test2',
    'test2',
    new DateTime()
);

// 1. Notiz erstellen

$repository->add($note);

// 2. Notiz ändern
//$repository->edit($note);

// 3. Notiz löschen
//$repository->delete(1);

// 4. Notizen abfragen
$query = "SELECT * FROM notices";
$statement = $pdo->prepare($query);
$statement->execute();