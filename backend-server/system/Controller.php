<?php

class Controller
{

    public $db;

    public function __construct()
    {
        $this->db = MysqliDb::getInstance();
    }

    public function response($content, $content_type)
    {
        if ($content_type == 'json') {
            $content = json_encode($content);
            header('Content-Type: application/json');
            echo $content;
        }
    }

    public function output($template, $data = null)
    {
        new View($template, $data);
    }

    public function is_api()
    {
        if (isset($_GET['route']) && explode('/', $_GET['route'])[0] == 'api')
            return true;
        return false;
    }

    public function getPost()
    {
        return json_decode(file_get_contents('php://input'), true);
    }
}
