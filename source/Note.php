<?php


namespace NotesApi;

use DateTime;

/**
 * Class Note
 * @package NotesApi
 */
final class Note
{
    /** @var int */
    private $user_id;

    /** @var int */
    private $offset;

    /** @var string */
    private $title;

    /** @var string */
    private $text;

    /** @var DateTime */
    private $createdAt;

    /**
     * Note constructor.
     * @param int $user_id
     * @param int $offset
     * @param string $title
     * @param string $text
     * @param DateTime $createdAt
     */
    public function __construct(int $user_id, int $offset, string $title, string $text, DateTime $createdAt)
    {
        $this->user_id = $user_id;
        $this->offset = $offset;
        $this->title = $title;
        $this->text = $text;
        $this->createdAt = $createdAt;
    }

    /**
     * @return int
     */
    public function getUser_id(): int
    {
        return $this->user_id;
    }

    /**
     * @return int
     */
    public function getOffset(): int
    {
        return $this->offset;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @return string
     */
    public function getText(): string
    {
        return $this->text;
    }

    /**
     * @return DateTime
     */
    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }
}