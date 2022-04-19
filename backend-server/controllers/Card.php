<?php

class Card extends Controller
{
    public function add()
    {
        if (
            isset($_GET['uid']) && !empty($_GET['uid'])
            && isset($_GET['assigned_to']) && !empty($_GET['assigned_to']) && is_numeric($_GET['assigned_to'])
            && isset($_GET['is_active']) && !empty($_GET['is_active']) && is_numeric($_GET['is_active'])
            && isset($_GET['expires_at']) && !empty($_GET['expires_at'])
            && isset($_GET['modified_by']) && !empty($_GET['modified_by']) && is_numeric($_GET['modified_by'])
        ) {
            $data = array(
                "uid" => $_GET['uid'],
                "assigned_to" => (int) $_GET['assigned_to'],
                "is_active" => (int) $_GET['is_active'],
                "expires_at" => $_GET['expires_at'],
                "modified_by" => (int) $_GET['modified_by'],
                "modified_at" => $this->db->now()
            );
            $id = $this->db->insert('cards', $data);
            if ($id)
                $this->response(['success' => 'true'], 'json');
            else
                $this->response(['success' => 'false'], 'json');
        }
    }

    public function update()
    {
        if (isset($_GET['card_id']) && !empty($_GET['card_id']) && is_numeric($_GET['card_id'])) {
            if (isset($_GET['uid']) && !empty($_GET['uid']))
                $data["uid"] = $_GET['uid'];
            if (isset($_GET['assigned_to']) && !empty($_GET['assigned_to']) && is_numeric($_GET['assigned_to']))
                $data["assigned_to"] = (int) $_GET['assigned_to'];
            if (isset($_GET['is_active']) && !empty($_GET['is_active']) && is_numeric($_GET['is_active']))
                $data["is_active"] = (int) $_GET['is_active'];
            if (isset($_GET['expires_at']) && !empty($_GET['expires_at']))
                $data["expires_at"] = $_GET['expires_at'];
            if (isset($_GET['modified_by']) && !empty($_GET['modified_by']) && is_numeric($_GET['modified_by']))
                $data["modified_by"] = (int) $_GET['modified_by'];
            $this->db->where('card_id', $_GET['uid']);
            if ($this->db->update('cards', $data))
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
            $logs = $this->db->arraybuilder()->paginate("cards", $page);
            $response['page'] = $_GET['page'];
            $response['page_limit'] = $this->db->pageLimit;
            $response['total_pages'] = $this->db->totalPages;
            $response['payload'] = $logs;
        } else {
            $response['payload'] = $this->db->get("cards");
        }
        $this->response($response, 'json');
    }

    public function delete()
    {
        if (isset($_GET['card_id']) && !empty($_GET['card_id']) && is_numeric($_GET['card_id'])) {
            $this->db->where('card_id', $_GET['card_id']);
            if ($this->db->delete('cards'))
                $this->response(['success' => 'true'], 'json');
            else
                $this->response(['success' => 'false'], 'json');
        }
    }
}
