<?php declare(strict_types=1);

namespace NotesApi;

use LogicException;
use PDO;
use RuntimeException;

/**
 * Class UserRepository
 * @package NotesApi
 */
final class UserRepository
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
     * @param string $email
     * @param string $password
     * @return int
     */
    public function authenticate(string $email, string $password): int
    {
        $statement = $this->pdo->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');

        $succeeds = $statement->execute([
            ':email' => $email
        ]);

        if (!$succeeds) {
            throw new RuntimeException('could not query user');
        }

        $record = $statement->fetch(PDO::FETCH_ASSOC);
        if ($record === false) {
            throw new LogicException('user could not be found');
        }

        if (password_verify($password, $record['password'])) {
            return (int)$record['id'];
        }

        throw new RuntimeException('password wrong');
    }

    public function createNewUser(string $email, string $password): void
    {
        $statement = $this->pdo->prepare(
            'INSERT INTO users( email, password, created_at) 
                    VALUES (:email, :password, NOW())'
        );

        $statement->execute([
            ':email' => $email,
            ':password' => password_hash($password, PASSWORD_DEFAULT)
        ]);
    }

    public function existsWithEmail(string $email): bool
    {
        $statement = $this->pdo->prepare(
            "SELECT EXISTS (SELECT  * FROM users WHERE  email = :email)"
        );
        $statement->execute([
            ':email' => $email
        ]);
        return (bool)$statement->fetchColumn();
    }
}