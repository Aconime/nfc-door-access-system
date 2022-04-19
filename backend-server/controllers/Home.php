<?php

class Home extends Controller
{

    public function index()
    {
        $this->output('home');
    }

    public function error()
    {
        if ($this->is_api())
            $this->response([
                'success' => 'false',
                "error" => "unknown"
            ], 'json');
        else
            $this->output('error');
    }

    public function login()
    {
        if (isset($_GET['username']) && !empty($_GET['username']) && isset($_GET['password']) && !empty($_GET['password'])) {
            $this->db->where("user_name", $_GET['username']);
            $results = $this->db->get('users');
            if ($results) {
                if (password_verify($_GET['password'], $results[0]['password'])) {
                    $token = Helpers::token();
                    //token generated
                    $this->db->where("user_id", $results[0]['user_id'])
                        ->update("api_keys", ["is_active" => 0]); //only one session at a time
                    $this->db->insert("api_keys", [
                        "api_key" => $token,
                        "user_id" => $results[0]['user_id'],
                        "is_active" => 1,
                        "expires_at" => $this->db->now('+1d')
                    ]);
                    $this->response([
                        "success" => "true",
                        "api_token" => $token,
                        "user_id" => $results[0]['user_id']
                    ], "json");
                } else {
                    $this->response([
                        'success' => 'false',
                        'error' => 'Invalid Credentials'
                    ], 'json');
                }
            } else {
                $this->response([
                    'success' => 'false',
                    'error' => 'Invalid Credentials'
                ], 'json');
            }
        } else {
            $this->response([
                'success' => 'false',
                'error' => 'Incorrect parameters'
            ], 'json');
        }
    }

    public function register()
    {
        if (isset($_GET['string'])) {
            echo Helpers::Hash($_GET['string']);
        }
    }
}
