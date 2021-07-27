<?php declare(strict_types=1);

use Fig\Http\Message\StatusCodeInterface;
use NotesApi\HttpRequest;
use NotesApi\HttpResponder;
use NotesApi\MysqlConnection;
use NotesApi\Note;
use NotesApi\NotesRepository;
use NotesApi\Session;

require_once __DIR__ . '/../../vendor/autoload.php';


$session = new Session();

if ($session->get('user_id') === null) {
    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_UNAUTHORIZED,
            [
                'Cache-Control' => 'no-cache'
            ],
            json_encode(
                [
                    'success' => false,
                    'error' => 'not logged in'
                ],
                JSON_THROW_ON_ERROR
            )
        )
    );
}

$userId = (int)$session->get('user_id');
$request = new HttpRequest();
$status = StatusCodeInterface::STATUS_OK;

$settings = require __DIR__ . '/../../config/database.php';

$pdo = MysqlConnection::fromConfig($settings);
$noteRepository = new NotesRepository($pdo);

if ($request->getMethod() === 'GET') {
    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_OK,
            [
                'Cache-Control' => 'no-cache'
            ],
            json_encode(array_map(
                static function (Note $note): array {
                    return [
                        'title' => $note->getTitle(),
                        'text' => $note->getText(),
                        'createdAt' => $note->getCreatedAt()->format('Y-m-d H:i:s')
                    ];
                },
                $noteRepository->findAll($userId)),
                JSON_THROW_ON_ERROR
            )
        )
    );
}

if ($request->getMethod() !== 'POST') {
    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_METHOD_NOT_ALLOWED,
            [
                'Cache-Control' => 'no-cache'
            ],
            json_encode(
                [
                    'success' => false,
                    'error' => 'method not allowed'
                ],
                JSON_THROW_ON_ERROR
            )
        )
    );
}


try {
    $notes = json_decode($request->getBody(), true, 512, JSON_THROW_ON_ERROR);

    $noticeCount = count($notes);
    for ($i = 0; $i < $noticeCount; $i++) {
        $record = $notes[$i];
        $notes[$i] = new Note(
            $userId,
            $i,
            $record['title'],
            $record['text'],
            new DateTime($record['createdAt'])
        );
    }

    foreach ($noteRepository->getIndices($userId) as $offset) {
        if (!isset($notes[$offset])) {
            $noteRepository->deleteAtOffsetAndId($userId, $offset);
        }
    }

    foreach ($notes as $offset => $note) {
        if ($noteRepository->existsAtOffset($userId, $offset)) {
            $noteRepository->edit($userId, $note);
        } else {
            $noteRepository->add($userId, $note);
        }
    }

    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_OK,
            [
                'Cache-Control' => 'no-cache'
            ],
            json_encode(
                [
                    'success' => true,
                    'message' => 'notices successfully stored'
                ],
                JSON_THROW_ON_ERROR
            )
        )
    );
} catch (PDOException $exception) {
    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_BAD_REQUEST,
            [
                'Cache-Control' => 'no-cache'
            ],
            json_encode(
                [
                    'success' => false,
                    'error' => 'notices could not written'
                ],
                JSON_THROW_ON_ERROR
            )
        )
    );
} catch (JsonException $exception) {
    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_BAD_REQUEST,
            [
                'Cache-Control' => 'no-cache'
            ],
            json_encode(
                [
                    'success' => false,
                    'error' => 'wrong payload'
                ],
                JSON_THROW_ON_ERROR
            )
        )
    );
} catch (Throwable $exception) {
    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_BAD_REQUEST,
            [
                'Cache-Control' => 'no-cache'
            ],
            json_encode(
                [
                    'success' => false,
                    'error' => $exception->getMessage()
                ],
                JSON_THROW_ON_ERROR
            )
        )
    );
}