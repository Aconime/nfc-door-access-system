<?php

class Log extends Controller
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
            $page = (int) $_GET['page'];
            if (isset($_GET['since']) && !empty($_GET['since'])) {
                $this->db->where('logged_at', $_GET['since'], '>=');
            }
            $logs = $this->db->arraybuilder()->orderBy("logged_at", "Desc")->paginate("logs", $page);
            $response['page'] = $_GET['page'];
            $response['page_limit'] = $this->db->pageLimit;
            $response['total_pages'] = $this->db->totalPages;
            $response['payload'] = $logs;
        } else {
            if (isset($_GET['since']) && !empty($_GET['since'])) {
                $this->db->where('logged_at', $_GET['since'], '>=');
            }
            $response['payload'] = $this->db->orderBy("logged_at", "Desc")->get("logs");
        }
        $this->response($response, 'json');
    }

    public function investigate()
    {
        if (
            isset($_GET['log_id']) && !empty($_GET['log_id']) && is_numeric($_GET['log_id']) &&
            isset($_GET['has_investigated']) && !empty($_GET['has_investigated']) && is_numeric($_GET['has_investigated'])
        ) {
            $data = array(
                'has_investigated' => $_GET['has_investigated'],
                'investigated_at' => $this->db->now()
            );
            $this->db->where('log_id', $_GET['log_id']);
            if ($this->db->update('logs', $data))
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
}
