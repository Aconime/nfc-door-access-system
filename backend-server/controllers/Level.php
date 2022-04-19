<?php

class Level extends Controller
{
    public function add()
    {
        if (isset($_GET['level']) && !empty($_GET['level'])) {
            $data = array(
                "level" => $_GET['level']
            );
            $id = $this->db->insert('levels', $data);
            if ($id)
                $this->response(['success' => 'true'], 'json');
            else
                $this->response(['success' => 'false'], 'json');
        }
    }

    public function delete()
    {
        if (isset($_GET['level_id']) && !empty($_GET['level_id']) && is_numeric($_GET['level_id'])) {
            $this->db->where('level_id', $_GET['level_id']);
            if ($this->db->delete('levels'))
                $this->response(['success' => 'true'], 'json');
            else
                $this->response(['success' => 'false'], 'json');
        } else
            $this->response(['success' => 'false'], 'json');
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
            $levels = $this->db->arraybuilder()->paginate("levels", $page);
            $response['page'] = $_GET['page'];
            $response['page_limit'] = $this->db->pageLimit;
            $response['total_pages'] = $this->db->totalPages;
            $response['payload'] = $levels;
        } else {
            $response['payload'] = $this->db->get("levels");
        }
        $this->response($response, 'json');
    }
}
