<?php

class Routes
{
    protected $routes;

    protected function routeExists($route)
    {
        $this->routes = include ROOT . '/routes.php';
        if (array_key_exists($route, $this->routes)) {
            return true;
        } else {
            return false;
        }
    }

    public function getControllerAndMethod($route)
    {
        if (!$this->routeExists($route))
            return false;
        $ControllerAndMethod = $this->routes[$route];
        $ControllerAndMethod = explode('@', $ControllerAndMethod);
        if (!file_exists(ROOT . '/controllers/' . $ControllerAndMethod[1] . '.php'))
            return false;

        return [
            "Controller" => $ControllerAndMethod[1],
            "Method" => $ControllerAndMethod[0]
        ];
    }
}