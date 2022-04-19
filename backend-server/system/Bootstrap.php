<?php

/**
 * The main class where the app is bootstrapped
 */
class App
{
    public $routes;
    public $db;
    public $request_id;
    public $user_id;

    protected $controller;
    protected $method;

    public function __construct($route)
    {
        $this->db = new MysqliDb(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

        if (isset($_GET['route']) && explode('/', $_GET['route'])[0] == 'api')
            $this->auth();
        $this->routes = new Routes();
        $ControllerAndMethod = $this->routes->getControllerAndMethod($route);
        if ($ControllerAndMethod) {
            $this->controller = $ControllerAndMethod['Controller'];
            $this->method = $ControllerAndMethod['Method'];
        } else {
            $this->controller = "Home";
            $this->method = "error";
            echo "controller or method not found";
        }
    }

    public function run()
    {
        include ROOT . '/controllers/' . $this->controller . '.php';
        $controller = new $this->controller();
        if (!method_exists($controller, $this->method)) {
            header('Location: ' . ROOT_URL . '/error');
        }
        is_callable($controller->{$this->method}()) ?? $controller->{$this->method}();
    }

    protected function auth()
    {
        $data = array(
            "request_header" => json_encode(getallheaders()),
            "request_body" => json_encode($_REQUEST),
            "request_time" => $this->db->now()
        );

        if (!$this->verify_credentials()) {
            $response = ['error' => 'unauthorized'];
            $data['response'] = json_encode([
                'status_code' => 401,
                'body' => $response
            ]);
            $data['response_time'] = $this->db->now();
            header('HTTP/1.1 401 Unauthorized');

            $id = $this->db->insert('requests', $data);
            if ($id)
                $this->request_id = $id;
            $response['request-id'] = $id;
            echo json_encode($response);
            exit();
        }
    }

    protected function verify_credentials()
    {
        if (isset(getallheaders()['x-authorization-token'])) {
            $this->db->where("api_key", getallheaders()['x-authorization-token'])
                ->where("expires_at > NOW()")
                ->where("is_active", 1);
            $user_id = $this->db->getOne('api_keys');
            if ($user_id) {
                $this->user_id = $user_id['user_id'];
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
