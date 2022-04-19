<?php

class Access extends Controller
{
    public function all()
    {
        $response = [];
        if (isset($_GET['page']) && !empty($_GET['page']) && is_numeric($_GET['page'])) {
            if (isset($_GET['page_limit']) && !empty($_GET['page_limit']) && is_numeric($_GET['page_limit'])) {
                $this->db->pageLimit = (int) $_GET['page_limit'];
            } else {
                $this->db->pageLimit = 15;
            }
            $page = (int) $this->db->escape($_GET['page']);
            $access_list = $this->db->arraybuilder()->paginate("access_list", $page);
            $response['page'] = $this->db->escape($_GET['page']);
            $response['page_limit'] = $this->db->pageLimit;
            $response['total_pages'] = $this->db->totalPages;
            $response['payload'] = $access_list;
        } else {
            $response['payload'] = $this->db->get("access_list");
        }
        $this->response($response, 'json');
    }
}
