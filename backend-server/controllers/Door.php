<?php

class Door extends Controller
{
    public function add()
    {
        if (
            isset($_GET['door_identifier']) && !empty($_GET['door_identifier'])
            && isset($_GET['door_access_level_id']) && !empty($_GET['door_access_level_id']) && is_numeric($_GET['door_access_level_id'])
            && isset($_GET['is_active']) && !empty($_GET['is_active']) && is_numeric($_GET['is_active'])
        ) {
            $data = array(
                "door_identifier" => $_GET['door_identifier'],
                "door_access_level_id" => (int) $_GET['door_access_level_id'],
                "is_active" => (int) $_GET['is_active'],
                "modified_at" => $this->db->now()
            );
            $id = $this->db->insert('doors', $data);
            if ($id)
                $this->response(['success' => 'true'], 'json');
            else
                $this->response(['success' => 'false'], 'json');
        } else {
            $this->response([
                'success' => 'false',
                'error' => 'Incorrect parameters'
            ], 'json');
        }
    }

    public function edit()
    {
        if (isset($_GET['door_id']) && !empty($_GET['door_id']) && is_numeric($_GET['door_id'])) {
            if (isset($_GET['door_identifier']) && !empty($_GET['door_identifier']))
                $data["door_identifier"] = $_GET['door_identifier'];
            if (isset($_GET['door_access_level_id']) && !empty($_GET['door_access_level_id']) && is_numeric($_GET['door_access_level_id']))
                $data["door_access_level_id"] = (int) $_GET['door_access_level_id'];
            // if (isset($_GET['is_active']) && !empty($_GET['is_active']) && is_numeric($_GET['is_active']))
            $data["is_active"] = (int) $_GET['is_active'];
            $this->db->where('door_id', $_GET['door_id']);
            if ($this->db->update('doors', $data))
                $this->response(['success' => 'true'], 'json');
            else
                $this->response(['success' => 'false'], 'json');
        } else {
            $this->response([
                'success' => 'false',
                'error' => 'Incorrect parameters'
            ], 'json');
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
            $doors = $this->db->arraybuilder()->paginate("doors", $page);
            $response['page'] = $_GET['page'];
            $response['page_limit'] = $this->db->pageLimit;
            $response['total_pages'] = $this->db->totalPages;
            $response['payload'] = $doors;
        } else {
            $response['payload'] = $this->db->get("doors");
        }

        $this->response($response, 'json');
    }

    public function delete()
    {
        if (isset($_GET['door_id']) && !empty($_GET['door_id']) && is_numeric($_GET['door_id'])) {
            $this->db->where('door_id', $_GET['door_id']);
            if ($this->db->delete('doors'))
                $this->response(['success' => 'true'], 'json');
            else
                $this->response(['success' => 'false'], 'json');
        }
    }
}
