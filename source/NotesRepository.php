<?php declare(strict_types=1);

namespace NotesApi;

use DateTime;
use Exception;
use PDO;
use RuntimeException;

/**
 * Class NotesRepository
 * @package NotesApi
 */
final class NotesRepository
{
    /** @var PDO */
    private $pdo;

    /**
     * NotesRepository constructor.
     * @param PDO $pdo
     */
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * @param int $userId
     * @param int $offset
     * @return bool
     */
    public function existsAtOffset(int $userId, int $offset): bool
    {
        $statement = $this->pdo->prepare(
            "SELECT EXISTS (SELECT  * FROM notes WHERE  offset = :offset AND user_id = :userId)"
        );
        $succeeds = $statement->execute([
            ':offset' => $offset,
            ':userId' => $userId
        ]);

        if (!$succeeds) {
            throw new RuntimeException('not cloud not be loaded');
        }

        return (bool)$statement->fetchColumn();
    }

    /**
     * @param Note $note
     * @param int $userId
     */
    public function add(int $userId, Note $note): void
    {
        $statement = $this->pdo->prepare(
            "INSERT INTO notes(user_id, offset, title, text, created_at) VALUES (:user_id, :offset, :title, :text, :created_at)"
        );
        $succeeds = $statement->execute([
            ':user_id' => $userId,
            ':offset' => $note->getOffset(),
            ':title' => $note->getTitle(),
            ':text' => $note->getText(),
            ':created_at' => $note->getCreatedAt()->format('Y-m-d H:i:s')
        ]);

        if (!$succeeds) {
            throw new RuntimeException('note could not be added');
        }
    }

    /**
     * @param int $userId
     * @param Note $note
     */
    public function edit(int $userId, Note $note): void
    {

        $statement = $this->pdo->prepare(
            "UPDATE notes
                        SET 
                            title = :title,
                            text = :text, 
                            created_at = :created_at
                        WHERE offset = :offset
                        AND user_id = :user_id"
        );
        $statement->execute([
            ':offset' => $note->getOffset(),
            ':user_id' => $userId,
            ':title' => $note->getTitle(),
            ':text' => $note->getText(),
            ':created_at' => $note->getCreatedAt()->format('Y-m-d H:i:s')
        ]);
    }

    /**
     * @param int $userId
     * @param int $offset
     */
    public function deleteAtOffsetAndId(int $userId, int $offset): void
    {
        $statement = $this->pdo->prepare("DELETE FROM notes WHERE offset = :offset AND user_id = :user_id");
        $statement->execute([
            ':offset' => $offset,
            ':user_id' => $userId
        ]);
    }


    /**
     * @return int[]
     */
    public function getIndices(int $userId): array
    {
        $statement = $this->pdo->prepare('SELECT offset FROM notes WHERE user_id = :userId');

        $statement->execute([
            ':userId' => $userId
        ]);

        return array_map('intval', $statement->fetchAll(PDO::FETCH_COLUMN));
    }


    /**
     * @param int $userId
     * @return Note[]
     * @throws Exception
     */
    public function findAll(int $userId): array
    {
        $statement = $this->pdo->prepare('SELECT * FROM notes WHERE user_id = :userId');

        $statement->execute([
            ':userId' => $userId
        ]);

        $records = $statement->fetchAll(PDO::FETCH_ASSOC);
        $notes = [];

        foreach ($records as $record) {
            $notes[] = new Note(
                $userId,
                (int)$record['offset'],
                $record['title'],
                $record['text'],
                new DateTime($record['created_at'])
            );
        }
        return $notes;
    }
}