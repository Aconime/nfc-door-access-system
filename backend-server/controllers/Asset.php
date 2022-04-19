<?php

class Asset extends Controller
{
    public function init()
    {
        $response = $this->getPost();
        if (!isset($response['asset_id']) || empty($response['asset_id']))
            return false;

        $this->db->where("asset_id", $this->db->escape($response['asset_id']))->where('is_active', 1);
        if ($this->db->getOne('assets')) {
            $token = Helpers::token();
            $this->db->where('asset_id', $this->db->escape($response['asset_id']))
                ->update('assets', ['asset_token' => $token, 'token_created_at' => $this->db->now()]);
            $this->response([
                'success' => true,
                'token' => $token
            ], 'json');
        } else {
            $this->log('The asset (' . $this->db->escape($response['asset_id']) . ') has failed to connect to the server', 4);
            $this->response(['success' => false], 'json');
        }
    }

    public function access()
    {
        $response = $this->getPost();

        if (!isset(getallheaders()['x-asset-token']) || !isset($response['asset_id']) || empty($response['asset_id'])) {
            return $this->response([
                'access' => 'not_granted',
                'error' => 'missing_parameters',
                'checked_at' => time()
            ], 'json');
        }

        $this->db->where('asset_token', getallheaders()['x-asset-token'])->where('asset_id', $response['asset_id']);
        if (!$this->db->getOne('assets', 'count(1)'))
            return $this->response([
                'access' => 'not_granted',
                'error' => 'wrong_token',
                'checked_at' => time()
            ], 'json');

        if (!isset($response['uid']) || empty($response['uid']))
            return $this->response([
                'access' => 'not_granted',
                'checked_at' => time()
            ], 'json');

        $this->db->join("cards c", "u.user_id=c.assigned_to", "INNER");
        $this->db->where("c.uid", $this->db->escape($response['uid']));
        $this->db->where("expires_at", "now()", ">");
        $card = $this->db->getOne("users u", "*, u.is_active AS is_user_active");

        if (!$card)
            return $this->response([
                'access' => 'not_granted',
                'error' => 'card_not_found',
                'checked_at' => time()
            ], 'json');

        $this->db->join("assets a", "d.door_id=a.door_id", "INNER");
        $this->db->where("a.asset_id", $this->db->escape($response['asset_id']));
        $asset = $this->db->getOne("doors d", "*, d.is_active AS is_door_active");

        $data = [
            'user_id' => $card['assigned_to'],
            'door_id' => $asset['door_id'],
            'card_id' => $card['card_id'],
            'asset_id' => $asset['asset_id'],
            'accessed_at' => $this->db->now()
        ];

        if ($this->isApproved($asset, $card)) {
            $data['is_approved'] = 1;
            $this->response([
                'access' => 'granted',
                'checked_at' => time()
            ], 'json');
        } else {
            $data['is_approved'] = 0;
            $this->response([
                'access' => 'not_granted',
                'error' => 'validation failed',
                'checked_at' => time()
            ], 'json');
        }
        $this->db->insert('access_list', $data);
    }

    protected function isApproved($asset, $card)
    {
        if (!$this->isValidEntry($asset, $card))
            return false;

        /**
         * Check consecutive door access in last 5 minutes
         * Block and log them for more than 3 attempts
         */

        $accesses = $this->db->where('user_id', $card['assigned_to'])
            ->where('door_id', $asset['door_id'])
            ->where('card_id', $card['card_id'])
            ->where('asset_id', $asset['asset_id'])
            ->where('accessed_at > NOW() - interval 5 minute')
            ->getOne('access_list', 'count(1)');

        if ((int) $accesses['count(1)'] > 2) {
            $this->log(sprintf(
                '%s has tried to access door %s with asset (Asset ID: %d) for %d times in last 5 minutes',
                $card['first_name'] . ' ' . $card['last_name'],
                explode(':', $asset['door_identifier'])[1],
                $asset['asset_id'],
                (int) $accesses['count(1)']
            ), 3);
            return false;
        }

        return true;
    }

    protected function isValidEntry($asset, $card)
    {
        /**
         * If any of these are not active, do not approve.
         */
        if (!$asset['is_active'] || !$asset['is_door_active'] || !$card['is_active'] || !$card['is_user_active'])
            return false;

        /**
         * Need to check whether the card has global access
         */
        if ($card['allow_global_level_access']) return true;

        /**
         * Let's whether the user has level access
         */
        if ($asset['door_access_level_id'] == $card['user_access_level_id']) return true;

        /**
         * Let's check whether the card has access to the level
         */
        $levels = $this->db->where('card_id', $card['card_id'])->get('card_to_level');
        foreach ($levels as $level) {
            if (($level['level_id'] == $asset['door_access_level_id']) && $level['is_allowed'])
                return true;
        }

        /**
         * Let's check whether the card has access to the door
         */
        $doors = $this->db->where('card_id', $card['card_id'])->get('card_to_door');
        foreach ($doors as $door) {
            if (($door['door_id'] == $asset['door_id']) && $door['is_allowed'])
                return true;
        }

        return false;
    }

    protected function log($message, $severity)
    {
        /**
         * Insert the logs.
         * NOtify the admin if severity is greater than 3.
         * Severity runs from 1 to 5 where 5 is most severe.
         */
        $data = [
            'log_category' => 'access',
            'message' => $message,
            'severity' => $severity,
            'logged_at' => $this->db->now()
        ];

        if ((int) $severity > 3) {
            //code to notify admin
            $data['is_notified'] = 1;
        }

        $this->db->insert('logs', $data);
    }
}
