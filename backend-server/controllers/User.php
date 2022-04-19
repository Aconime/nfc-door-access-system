<?php

class User extends Controller
{
    protected $error = [];

    public function add()
    {
        $validate = $this->validate_add_user();
        if ($validate == true) {
            $data = array(
                "first_name" => $_GET['first_name'],
                "last_name" => $_GET['last_name'],
                "email" => $_GET['email'],
                "allow_global_level_access" => ($_GET['type_of_access'] == 'Administrator' ? 1 : 0),
                "created_at" => $this->db->now(),
                "modified_at" => $this->db->now()
            );
            if (isset($_GET['username']) && !empty($_GET['username']))
                $data['username'] = $_GET['username'];

            if (isset($_GET['password']) && !empty($_GET['password']))
                $data['password'] = Helpers::Hash($_GET['password']);

            if (isset($_GET['user_access_level_id']) && !empty($_GET['user_access_level_id']))
                $data['user_access_level_id'] = $_GET['user_access_level_id'];

            if (isset($_GET['is_active']) && !empty($_GET['is_active']) && is_numeric($_GET['is_active']))
                $data['is_active'] = $_GET['is_active'];
            else
                $data['is_active'] = 0;

            if (isset($_GET['role']) && !empty($_GET['role']) && is_numeric($_GET['role']))
                $data['role'] = $_GET['role'];
            elseif ($_GET['type_of_access'] == 'Administrator')
                $data['role'] = 1;
            else
                $data['role'] = 2;

            if (isset($_GET['employee_id']) && !empty($_GET['employee_id']))
                $data['employee_id'] = $_GET['employee_id'];

            if (isset($_GET['comments']) && !empty($_GET['comments']))
                $data['comments'] = $_GET['comments'];

            $id = $this->db->insert('users', $data);
            if ($id) {
                if (isset($_GET['cards']) && !empty($_GET['cards'])) {
                    if (isset($_GET['expires_at']) && !empty($_GET['expires_at']))
                        $card_data = ['assigned_to' => $id, 'is_active' => 1, 'expires_at' => $_GET['expires_at']];
                    else
                        $card_data = ['assigned_to' => $id, 'is_active' => 1];
                    //one card per user for now
                    $this->db->where('card_id', (int) $_GET['cards']);
                    if (!$this->db->update('cards', $card_data))
                        $this->error[] = 'The card was not assigned to the user';
                }
                if (isset($_GET['levels']) && !empty($_GET['levels'])) {
                    //if (str_contains($_GET['levels'], ','))
                    if (false !== strpos($_GET['levels'], ','))
                        $levels = explode(',', $_GET['levels']);
                    else
                        $levels = [$_GET['levels']];

                    foreach ($levels as $level) {
                        if (!$this->db->insert('card_to_level', [
                            'card_id' => (int) $_GET['cards'],
                            'level_id' => $level, 'is_allowed' => 1
                        ]))
                            $this->error[] = 'The level id ' . $level . ' was not assigned to card id ' . (int) $_GET['cards'];
                    }
                }

                if (isset($_GET['doors']) && !empty($_GET['doors'])) {
                    // if (str_contains($_GET['doors'], ',')) //introduced in php 8
                    if (false !== strpos($_GET['doors'], ','))
                        $doors = explode(',', $_GET['doors']);
                    else
                        $doors = [$_GET['doors']];

                    foreach ($doors as $door) {
                        if (!$this->db->insert('card_to_door', [
                            'card_id' => (int) $_GET['cards'],
                            'door_id' => $door, 'is_allowed' => 1
                        ]))
                            $this->error[] = 'The door id ' . $door . ' was not assigned to card id ' . (int) $_GET['cards'];
                    }
                }
                $this->response([
                    'success' => 'true',
                    "user_id" => $id
                ], 'json');
            } else
                $this->response(['success' => 'false'], 'json');
        } else
            $this->response([
                'success' => 'false',
                "error" => $validate
            ], 'json');
    }

    protected function validate_add_user()
    {
        if (
            !isset($_GET['first_name']) || empty($_GET['first_name'])
            || !isset($_GET['last_name']) || empty($_GET['last_name'])
            || !isset($_GET['email']) || empty($_GET['email'])
            // || !isset($_GET['cards']) || empty($_GET['cards'])
            // || !isset($_GET['doors']) || empty($_GET['doors'])
            // || !isset($_GET['levels']) || empty($_GET['levels'])
            || !isset($_GET['type_of_access']) || empty($_GET['type_of_access'])
        ) {
            return 'Invalid Parameters';
        }

        if (!filter_var($_GET['email'], FILTER_VALIDATE_EMAIL)) {
            return 'Invalid email';
        }

        $this->db->where('email', $_GET['email']);
        if ($this->db->getOne('users'))
            return 'User already exists';

        return true;
    }

    public function edit()
    {
        if (!isset($_GET['user_id']) || empty($_GET['user_id']))
            return $this->response([
                'success' => 'false',
                "error" => 'No user_id was provided'
            ], 'json');

        $data = array(
            "modified_at" => $this->db->now()
        );

        if (isset($_GET['first_name']) && !empty($_GET['first_name']))
            $data['first_name'] = $_GET['first_name'];

        if (isset($_GET['last_name']) && !empty($_GET['last_name']))
            $data['last_name'] = $_GET['last_name'];

        if (isset($_GET['email']) && !empty($_GET['email']))
            $data['email'] = $_GET['email'];

        if (isset($_GET['username']) && !empty($_GET['username']))
            $data['username'] = $_GET['username'];

        if (isset($_GET['password']) && !empty($_GET['password']))
            $data['password'] = $_GET['password'];

        if (isset($_GET['user_access_level_id']) && !empty($_GET['user_access_level_id']))
            $data['user_access_level_id'] = $_GET['user_access_level_id'];

        if (isset($_GET['type_of_access']) && !empty($_GET['type_of_access']))
            $data['allow_global_level_access'] = ($_GET['type_of_access'] == 'Administrator' ? 1 : 0);

        if (isset($_GET['role']) && !empty($_GET['role']) && is_numeric($_GET['role']))
            $data['role'] = $_GET['role'];
        elseif ($_GET['type_of_access'] == 'Administrator')
            $data['role'] = 1;
        else
            $data['role'] = 2;

        if (isset($_GET['is_active']) && !empty($_GET['is_active']) && is_numeric($_GET['is_active']))
            $data['is_active'] = $_GET['is_active'];

        if (isset($_GET['employee_id']) && !empty($_GET['employee_id']))
            $data['employee_id'] = $_GET['employee_id'];

        if (isset($_GET['comments']) && !empty($_GET['comments']))
            $data['comments'] = $_GET['comments'];

        $this->db->where('user_id', $_GET['user_id']);

        if (!$this->db->update('users', $data))
            return $this->response([
                'success' => 'false',
                "error" => 'Could not update the user'
            ], 'json');

        if (isset($_GET['cards']) && !empty($_GET['cards'])) {
            $card_id = $_GET['cards'];
            if (!$this->db->where('assigned_to', $_GET['user_id'])->update('cards', ['assigned_to' => NULL]))
                $this->error[] = 'The card was not assigned to the user';
            $cards_data = [];
            $cards_data['assigned_to'] = $_GET['user_id'];
            if (isset($_GET['expires_at']) && !empty($_GET['expires_at']))
                $cards_data['expires_at'] = $_GET['expires_at'];
            $this->db->where('card_id', (int) $_GET['cards']);
            $this->db->update('cards', $cards_data);
        } else {
            $card_id = $this->db->where('assigned_to', $_GET['user_id'])
                ->getOne('cards', 'card_id')['card_id'];
        }


        if (isset($_GET['levels']) && !empty($_GET['levels'])) {
            if (false != strpos($_GET['levels'], ','))
                $levels = explode(',', $_GET['levels']);
            else
                $levels = [$_GET['levels']];

            $this->db->where('card_id', $card_id)->delete('card_to_level');

            foreach ($levels as $level) {
                if (!$this->db->insert('card_to_level', [
                    'card_id' => (int) $_GET['cards'],
                    'level_id' => $level, 'is_allowed' => 1
                ]))
                    $this->error[] = 'The level id ' . $level . ' was not assigned to card id ' . (int) $_GET['cards'];
            }
        }

        if (isset($_GET['doors']) && !empty($_GET['doors'])) {
            if (false != strpos($_GET['doors'], ','))
                $doors = explode(',', $_GET['doors']);
            else
                $doors = [$_GET['doors']];

            $this->db->where('card_id', $card_id)->delete('card_to_door');

            foreach ($doors as $door) {
                if (!$this->db->insert('card_to_door', [
                    'card_id' => (int) $_GET['cards'],
                    'door_id' => $door, 'is_allowed' => 1
                ]))
                    $this->error[] = 'The door id ' . $door . ' was not assigned to card id ' . (int) $_GET['cards'];
            }
        }
        return $this->response([
            'success' => 'true'
        ], 'json');
    }

    public function activate()
    {
        if (
            isset($_GET['user_id']) && !empty($_GET['user_id']) && is_numeric($_GET['user_id'])
            /* && isset($_GET['is_active']) && !empty($_GET['is_active'] )*/
        ) {
            $activate = $this->db->where("user_id", $_GET['user_id'])
                ->update("users", ["is_active" => $_GET['is_active']]);
            if ($activate) {
                $this->response(['success' => 'true'], 'json');
            } else {
                $this->response(['success' => 'false'], 'json');
            }
        } else {
            $this->response(['success' => 'false'], 'json');
        }
    }

    public function delete()
    {
        if (isset($_GET['user_id']) && !empty($_GET['user_id']) && is_numeric($_GET['user_id'])) {
            $this->db->where('user_id', $this->db->escape($_GET['user_id']));
            if ($this->db->delete('users'))

                $this->response(['success' => 'true'], 'json');
            else
                $this->response(['success' => 'false'], 'json');
        }
    }

    public function all()
    {
        $response = [];
        if (isset($_GET['page']) && !empty($_GET['page']) && is_numeric($_GET['page'])) {
            if (isset($_GET['page_limit']) && !empty($_GET['page_limit']) && is_numeric($_GET['page_limit'])) {
                $this->db->pageLimit = (int) $_GET['page_limit'];
            } else {
                $this->db->pageLimit = 15;
            }
            $page = (int) $_GET['page'];
            $doors = $this->db->arraybuilder()->paginate("users", $page);
            $response['page'] = $_GET['page'];
            $response['page_limit'] = $this->db->pageLimit;
            $response['total_pages'] = $this->db->totalPages;
            $response['payload'] = $doors;
        } else {
            $response['payload'] = $this->db->get("users");
        }

        $this->response($response, 'json');
    }

    /**
     * Get information about one user with their id
     */
    public function get()
    {
        if (!isset($_GET['user_id']) || empty($_GET['user_id']) || !is_numeric($_GET['user_id'])) {
            return $this->response([
                'success' => 'false',
                'error' => 'incorrect parameters'
            ], 'json');
        }

        $response = [];

        $user = $this->db->where('user_id', $this->db->escape($_GET['user_id']))->getOne("users");
        if (!$user) {
            return $this->response([
                'success' => 'false',
                'error' => 'invalid parameters'
            ], 'json');
        }

        $response['payload'] = $user;

        $response['payload']['cards'] = $this->db->where('assigned_to', $this->db->escape($_GET['user_id']))->get("cards");

        for ($i = 0; $i < count($response['payload']['cards']); $i++) {

            $response['payload']['cards'][$i]['doors'] = $this->db->join("doors d", "c.door_id=d.door_id", "INNER")
                ->where('c.card_id', $response['payload']['cards'][$i]['card_id'])
                ->get(
                    "card_to_door c",
                    null,
                    'c.door_id, is_allowed, door_identifier, door_access_level_id, is_active, modified_at'
                );

            $response['payload']['cards'][$i]['levels'] = $this->db->join("levels l", "c.level_id=l.level_id", "INNER")
                ->where('c.card_id', $response['payload']['cards'][$i]['card_id'])
                ->get(
                    "card_to_level c",
                    null,
                    'c.level_id, level, is_allowed'
                );
        }

        $this->response($response, 'json');
    }

    public function checkEmail()
    {
        $this->db->where('email', $_GET['email']);
        $user = $this->db->getOne('users');
        if ($user) {
            return $this->response(['user_id' => $user['user_id']], 'json');
        } else {
            return $this->response(['user_id' => 0], 'json');
        }
    }
}
