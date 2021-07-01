<?php declare(strict_types=1);

use Fig\Http\Message\StatusCodeInterface;
use NotesApi\HttpResponder;

require_once __DIR__ . '/../../vendor/autoload.php';


$request = new \NotesApi\HttpRequest();
$status = StatusCodeInterface::STATUS_OK;

if ($request->getMethod() !== 'POST') {
    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_METHOD_NOT_ALLOWED,
            [],
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
    $jsonObject = json_decode($request->getBody(), true, 512, JSON_THROW_ON_ERROR);

    $bytesWritten = file_put_contents(
        'notes.json',
        json_encode($jsonObject, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT)
    );

    if ( $bytesWritten === false)
    {
        throw new RuntimeException('could not write notices');
    }

    if ( $bytesWritten === 0 )
    {
        throw new RuntimeException('notices could not be empty');
    }

    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_OK,
            [],
            json_encode(
                [
                    'success' => true,
                    'message' => 'notices successfully stored'
                ],
                JSON_THROW_ON_ERROR
            )
        )
    );
} catch (JsonException $exception) {
    (new HttpResponder())->respond(
        new \NotesApi\HttpResponse(
            StatusCodeInterface::STATUS_BAD_REQUEST,
            [],
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