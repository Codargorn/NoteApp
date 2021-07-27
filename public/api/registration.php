<?php declare(strict_types=1);

use Fig\Http\Message\StatusCodeInterface;
use NotesApi\HttpResponder;
use NotesApi\MysqlConnection;
use NotesApi\Session;
use NotesApi\UserRepository;

require_once __DIR__ . '/../../vendor/autoload.php';

$session = new Session();
$request = new \NotesApi\HttpRequest();

$email = $request->getPostParams()['email'] ?? null;
$password = $request->getPostParams()['password'] ?? null;

$settings = require __DIR__ . '/../../config/database.php';

$pdo = MysqlConnection::fromConfig($settings);
$userRepository = new UserRepository($pdo);

if ($email && !$password) {
    if ($userRepository->existsWithEmail($email)) {

        (new HttpResponder())->respond(
            new \NotesApi\HttpResponse(
                StatusCodeInterface::STATUS_OK,
                [
                    'Cache-Control' => 'no-cache'
                ],
                json_encode(
                    [
                        'success' => true,
                        'error' => 'email already exists'
                    ],
                    JSON_THROW_ON_ERROR
                )
            )
        );
    }

    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_OK,
            [
                'Cache-Control' => 'no-cache'
            ],
            json_encode(
                [
                    'success' => false,
                    'error' => "email doesn't exist"
                ],
                JSON_THROW_ON_ERROR
            )
        )
    );
}

$userRepository->createNewUser($email, $password);

(new HttpResponder())->respond(
    new \NotesApi\HttpResponse(
        StatusCodeInterface::STATUS_OK,
        [
            'Cache-Control' => 'no-cache'
        ],
        json_encode(
            [
                'success' => true,
                'error' => 'User stored'
            ],
            JSON_THROW_ON_ERROR
        )
    )
);


