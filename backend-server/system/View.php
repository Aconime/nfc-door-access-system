<?php

class View
{

    public function __construct($template, $data)
    {
        if (file_exists(VIEWS_FOLDER . '/' . $template . '.php')) {
            is_null($data) ?: extract($data);
            header('Content-Type: text/html');
            include VIEWS_FOLDER . '/' . $template . '.php';
        }
    }
}